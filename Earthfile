VERSION 0.6
ARG CONTAINER_TAG=latest

web:
  FROM DOCKERFILE .

  RUN cp -a /opt/mastodon/public/assets /opt/mastodon/public.assets.dist
  RUN cp -a /opt/mastodon/public/packs /opt/mastodon/public.packs.dist

  VOLUME ["/opt/mastodon/public"]

  USER root
  ENV DEBIAN_FRONTEND=noninteractive
  RUN apt-get update && apt-get install -y rsync && apt-get clean
  USER mastodon

  SAVE IMAGE --push ghcr.io/jordemort/mastodon-web:${CONTAINER_TAG}

streaming:
  FROM DOCKERFILE -f ./streaming/Dockerfile .

  SAVE IMAGE --push ghcr.io/jordemort/mastodon-streaming:${CONTAINER_TAG}

all:
  BUILD +web
  BUILD +streaming
