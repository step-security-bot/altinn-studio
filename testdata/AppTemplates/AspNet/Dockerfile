FROM mcr.microsoft.com/dotnet/sdk:6.0-alpine@sha256:94cd1c5acd1ce9c9e707e4c9b6acce90c0f07d4424a021c343cbe67a94e28882 AS build
WORKDIR /

COPY /App ./App

WORKDIR /App

RUN dotnet build App.csproj --configuration Release --output /app_output
RUN dotnet publish App.csproj --configuration Release --output /app_output

FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine@sha256:8dc38eefb53bca69feb64a006012897d08d63b2fc2f21f054d4dfcc6cdd83782 AS final
EXPOSE 5005
WORKDIR /app
COPY --from=build /app_output .

# setup the user and group
# busybox doesn't include longopts, so the options are roughly
# -g --gid
# -u --uid
# -G --group
# -D --disable-password
# -s --shell
RUN addgroup -g 3000 dotnet && adduser -u 1000 -G dotnet -D -s /bin/false dotnet

USER dotnet
RUN mkdir /tmp/logtelemetry

ENTRYPOINT ["dotnet", "Altinn.App.dll"]
