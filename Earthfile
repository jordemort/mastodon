VERSION 0.6
ARG CONTAINER_TAG=latest

glitch:
  FROM DOCKERFILE .
  VOLUME ["/opt/mastodon/public"]
  SAVE IMAGE --push ghcr.io/jordemort/mastodon:${CONTAINER_TAG}
