# Docker Setup for E2E Suite

This docker setup is intended to be used as both a test harness and also as
local development infrastructure to enable fast-as-possible iteration.

For more docs on usage, see the root README in this monorepo.

## Multi-arch building

Eventually this will be put into our github actions but for now here are the
instructions for a multi-arch build (some of us have arm chips afterall).

```
docker buildx create --name dual_arm64_amd64 --platform linux/amd64,linux/arm/v8
```
