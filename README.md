# DAML KYC Portal

## Prerequisites

* [Yarn](https://yarnpkg.com/lang/en/docs/install/)
* [DAML SDK](https://docs.daml.com/getting-started/installation.html)

## Building and running locally

1. Build the DAML models and the UI project
```
make build
```

2. Start the sandbox ledger
```
daml start
```

3. In a new shell, start the UI
```
cd ui
yarn start
```

This opens a browser page pointing to `http://localhost:3000/#/login`. Note that the development server serves content via http and should not be exposed as is to a public-facing network.

Note that if you change your DAML models you need to run a full rebuild for the changes to propagate to your UI code:
```
make build
```
