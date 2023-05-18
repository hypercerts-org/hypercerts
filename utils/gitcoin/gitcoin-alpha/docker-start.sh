#!/bin/bash

echo "===== BUILDING ====" && \
  docker build -t local/hypercerts-utils . && \
  echo "===== RUNNING =====" && \
  docker run --rm -it \
    --name hypercerts-utils \
    --env-file .env \
    -v "$PWD":/code \
    -w /code/ \
    local/hypercerts-utils
