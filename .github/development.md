# Development

This document describes the process for running this application on your local computer.

## Prerequisites

- node.js > 18
- yarn > 1.22

## Getting started

You can configure `laskakit-data-feeder/.env` to simulate options from Homeassistant. (At least `LASKAKIT_URL`)

```sh
git git@github.com:radoslavirha/ha-addon-laskakit-data-feeder.git
cd ha-addon-laskakit-data-feeder
yarn install
cd laskakit-data-feeder
yarn start
```

You should now have a running server on [localhost:8000](http://localhost:8000).

When you're ready to stop your local server, type <kbd>Ctrl</kbd>+<kbd>C</kbd> in your terminal window.

Note that `yarn install` is step that should typically only need to be run once each time you pull the latest for a branch.

- `yarn install` does a clean install of dependencies, without updating the `yarn.lock` file

## Lint

Runs eslint on code:

```sh
yarn workspaces run lint
```

OR

```sh
cd laskakit-data-feeder
yarn lint
```

## Build

```sh
yarn workspaces run build
```

OR

```sh
cd laskakit-data-feeder
yarn build
```

When server is built, you can start it in production mode (suitable for HA add-on in docker) (requires env variables):

```sh
cd laskakit-data-feeder
yarn start:prod
```
