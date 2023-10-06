VERSION 0.6
ARG CONTAINER_TAG=latest

glitch:
  FROM DOCKERFILE .

  RUN cp -a /opt/mastodon/public/assets /opt/mastodon/public.assets.dist
  VOLUME ["/opt/mastodon/public"]

  USER root
  ENV DEBIAN_FRONTEND=noninteractive
  RUN apt-get update && apt-get install -y rsync && apt-get clean
  USER mastodon

  SAVE IMAGE --push ghcr.io/jordemort/mastodon:${CONTAINER_TAG}
