FROM maven:3.8.5-openjdk-17@sha256:3a9c30b3af6278a8ae0007d3a3bf00fff80ec3ed7ae4eb9bfa1772853101549b AS build
WORKDIR /build
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src src
RUN mvn -Pprod package

FROM mcr.microsoft.com/openjdk/jdk:17-ubuntu@sha256:7384038457ee05c7111bdb2d300156f6d33abf328fb90f3456c4b1dab7477a6b AS final
WORKDIR /app
COPY --from=build /build/target .
# setup the user and group
# the user will have no password, using shell /bin/false and using the group dotnet
RUN addgroup --gid 3000 dotnet && adduser --uid 1000 --ingroup dotnet --disabled-password --shell /bin/false dotnet
# update permissions of files if neccessary before becoming dotnet user
USER dotnet
CMD ["java", "-jar", "./Altinn.Platform.PDF-1.0.jar"]
