# hypercerts

Check back soon for more.

## Organization

- `/docs`: contains the documentation (Docusaurus)
- `/frontend`: contains the frontend application (Next.js)
- `/utils`: various scripts for operations
- [SDK](https://github.com/Network-Goods/hypercerts-sdk)
- [Smart contracts](https://github.com/Network-Goods/hypercerts-protocol)

## Links

- Hypercerts Dapp
  - [on Fleek](https://hypercerts.on.fleek.co/)
  - [on Vercel](https://hypercerts.vercel.app)
  - [on Netlify](https://hypercerts.netlify.app/)

## Setup and build

First, make sure the environment variables are set for `./frontend`.
Take a look at `./frontend/.env.local.example` for the complete list.
You can either set these yourself (e.g. in CI/CD) or copy the file to `.env.local` and populate it.

Then the do a turbo build of all apps, run the following:

```bash
yarn install
yarn build
```

The resulting static site can be found in `./build/`.

## Run

### Running the frontend dev server

```bash
yarn dev:frontend
```

### Running the prod server

If you've already run the build, you can use `yarn serve:build` to serve those files
