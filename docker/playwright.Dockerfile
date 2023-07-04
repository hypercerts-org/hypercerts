FROM mcr.microsoft.com/playwright:v1.35.0-jammy

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

RUN apt-get update && \
    apt-get install -y xvfb fluxbox x11vnc