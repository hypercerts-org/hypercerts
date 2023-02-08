# Frontend application

This frontend application is currently configured to use Next.js as a static site generator so that we can easily port the site hosting to any CDN. If we need server-side features (e.g. image optimization, SSR, etc), we can easily add those features later.

## Set up

All configurations are currently stored in environment variables.
See `.env.local.example` to see which variables need to be set.

The easiest way to get started is to copy this into `.env.local` and modify the file directly, which `next` will automatically load when running the dev server below.

## Run

```
yarn dev
```

Visit on `http://localhost:3000/`

## Export

This repository is currently set up to export to a static site:

```
yarn build
yarn export
```

This will place the static site in `/frontend/out`, which can be uploaded to any CDN or IPFS for hosting.
