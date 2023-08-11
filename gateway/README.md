# NIST Gateway

## Introduction

The NIST Gateway provides an Apollo GraphQL gateway providing access to the following GraphQL interfaces.

1. SAIL Auth Microservice
2. NIST Backend
3. SAIL Cargo Microservice

## Installation

```bash
$ npm install
```

## Running the app

The following environment variables are required to have the application run.

| Variable          | Purpose                     | Sample                                         |
| ----------------- | --------------------------- | ---------------------------------------------- |
| GATEWAY_NIST_URI  | URI of the NIST Backend     | `https://nist-staging.sail.codes/graphql`      |
| GATEWAY_CARGO_URI | URI of the Cargo Deployment | `https://cargo-staging.sail.codes/graphql`     |
| AUTH_URI          | URI of the Auth deployment  | `https://test-auth-service.sail.codes/graphql` |

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
