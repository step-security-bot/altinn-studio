# Building studio frontend
FROM node:20.8.0-alpine@sha256:37750e51d61bef92165b2e29a77da4277ba0777258446b7a9c99511f119db096 AS generate-studio-frontend
WORKDIR /build
COPY . .
RUN corepack enable
RUN yarn --immutable
RUN yarn build

# Building the backend
FROM mcr.microsoft.com/dotnet/sdk:6.0-alpine@sha256:94cd1c5acd1ce9c9e707e4c9b6acce90c0f07d4424a021c343cbe67a94e28882 AS generate-studio-backend
WORKDIR /build
COPY backend .
RUN dotnet build src/Designer/Designer.csproj -c Release -o /app_output
RUN dotnet publish src/Designer/Designer.csproj -c Release -o /app_output
RUN rm -f /app_output/Altinn.Studio.Designer.staticwebassets.runtime.json
# Prepare app template
WORKDIR /app_template
RUN apk add jq zip
RUN wget -O - https://api.github.com/repos/Altinn/app-template-dotnet/releases/latest | jq '.assets[]|select(.name | startswith("app-template-dotnet-") and endswith(".zip"))' | jq '.browser_download_url' | xargs wget -O apptemplate.zip && unzip apptemplate.zip && rm apptemplate.zip

# Building the final image
FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine@sha256:8dc38eefb53bca69feb64a006012897d08d63b2fc2f21f054d4dfcc6cdd83782 AS final
EXPOSE 80
WORKDIR /app
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    DOTNET_RUNNING_IN_CONTAINER=true
RUN apk add --no-cache icu-libs krb5-libs libgcc libintl libssl1.1 libstdc++ zlib

COPY --from=generate-studio-backend /app_output .
COPY --from=generate-studio-frontend /build/frontend/dist/app-development ./wwwroot/designer/frontend/app-development
COPY --from=generate-studio-frontend /build/frontend/dist/app-preview ./wwwroot/designer/frontend/app-preview
COPY --from=generate-studio-frontend /build/frontend/dist/dashboard ./wwwroot/designer/frontend/dashboard
COPY --from=generate-studio-frontend /build/frontend/dist/resourceadm ./wwwroot/designer/frontend/resourceadm
COPY --from=generate-studio-frontend /build/frontend/dist/language ./wwwroot/designer/frontend/lang

## Copying app template
COPY --from=generate-studio-backend /app_template ./Templates/AspNet
COPY backend/src/Designer/Migration ./Migration

ENTRYPOINT ["dotnet", "Altinn.Studio.Designer.dll"]
