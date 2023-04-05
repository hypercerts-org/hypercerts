# Frontend application

This frontend application is currently configured to use Next.js as a static site generator so that we can easily port the site hosting to any CDN. If we need server-side features (e.g. image optimization, SSR, etc), we can easily add those features later.

## Set up

All configurations are currently stored in environment variables.
See `.env.local.example` to see which variables need to be set.
We have pre-populated the file with the current testnet deployment on Goerli.

The easiest way to get started is to copy this into `.env.local` and modify the file directly, which `next` will automatically load when running the dev server below.

Note to developers: if you add or remove environment variables, make sure you update

- `.env.local.example`
- `./lib/config.ts`
- `../.github/workflows/ci-default.yml`
- Any CI/CD system (e.g. GitHub Actions, Pages)
- In your organization's secrets manager

### Plasmic

We use a no-code visual builder for React called [Plasmic](https://www.plasmic.app?ref=ryscheng). You can sign up for an account [here](https://www.plasmic.app?ref=ryscheng).

After signing up, you can check out the frontend [here](https://studio.plasmic.app/projects/bRx6ZFJBJ4PzQ8sSaLn1xW?ref=ryscheng). You will have read-only access to this project.

If you need to make edits, you can duplicate the project and update your project ID and API key in `.env.local`. For more information on setting up Plasmic, check out their [docs](https://docs.plasmic.app/learn/nextjs-quickstart).

### Web3 providers

Set up an account with a web3 provider like [Alchemy](https://alchemy.com/?r=17b797341eddfeda). Create a new application on Alchemy and set your `NEXT_PUBLIC_RPC_URL` environment variable.

### IPFS

We use [web3.storage](https://web3.storage/) for general blob storage and [nft.storage](https://nft.storage/) for storing token metadata.

Sign up for accounts and populate the `NEXT_PUBLIC_WEB3_STORAGE_TOKEN` and `NEXT_PUBLIC_NFT_STORAGE_TOKEN` environment variables with your API keys. For more information, you can check out their docs
([web3.storage](https://web3.storage/docs/), [nft.storage](https://nft.storage/docs/)).

### Supabase

We use [Supabase](https://supabase.com/) only as a non-essential cache.
In the future, we will either remove this dependency or add instructions on how to setup a local instance for development.
In the meantime, the app should still build with the placeholder values.

## Run development server

```
yarn dev
```

Visit on `http://localhost:3000/`

## Testing

To run linters:

```
yarn lint
```

To run unit tests:

```
yarn test
```

## Build and export

This repository is currently set up to export to a static site:

```
yarn build
```

This will place the static site in `/frontend/out`, which can be uploaded to any CDN or IPFS for hosting.

Note: This means that we do not currently use any server-side or edge functionality (e.g. middleware, SSR, image optimization etc)
