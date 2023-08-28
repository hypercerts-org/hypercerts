# Website

You can find the production version of this website at [https://hypercerts.org/docs](https://hypercerts.org/docs)

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

NOTE: By default, all edits to `docs/` will be hidden behind the `Next` version in the navbar until the version is released. To cut a release, see the section on [versioning](#versioning).

### Local Development

```
$ yarn
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Versioning

We leverage Docusaurus's built-in support for versioning.
For more details, see the [documentation](https://docusaurus.io/docs/versioning).

NOTE: Please keep the version number consistent with our SDK version numbers.

To create a new version:

```
yarn docusaurus docs:version VERSION_NUMBER

```

For your convenience, this script will create a new version based on `../sdk/package.json`

```
yarn version:new
```

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
