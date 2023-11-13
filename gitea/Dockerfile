FROM gitea/gitea:1.20.5-rootless@sha256:5f188b3b300d4cf3e7fae4fe2272b2d8991234b85b06f21aa98a1efb0a886748
USER 0:0
RUN apk --no-cache upgrade expat git libxml2 libcurl curl
USER 1000:1000
RUN mkdir -p /var/lib/gitea/git -p /var/lib/gitea/db -p /var/lib/gitea/avatars -p /var/lib/gitea/attachments

# copy configuration file
COPY --chown=git:git ./files/conf/app.ini /etc/gitea/app.ini
COPY --chown=git:git ./files/options /var/lib/gitea/custom/options/
COPY --chown=git:git ./files/public/img /var/lib/gitea/custom/public/img
COPY --chown=git:git ./files/templates /var/lib/gitea/custom/templates
