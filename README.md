# SignLab

## Introduction

SignLab is a tool for tagging short video clips. The most common use case
is a researcher starting a dedicated instance of SignLab, uploading a
series of videos with meta data for tagging, adding users to SignLab to
assist in tagging, then having exporting the tagged data for further
processing.

:warning: Further documentation on usage to come

## Code Organization

The code base is made up of an Angular front end (stored in `client/` folder)
and a NestJS backend (stored in `server/` folder). A Dockerfile and Docker
compose file is provided for packing up the application. A break down of the
top level folders is shown below.

* `client/`: Angular client side code
* `cypress/`: E2E Testing
* `docs/`: Sphinx documentation
* `server/`: NestJS server side code
* `shared/`: Code shared between client and server, currently only DTOs

The Angular front end is heavily coupled to the NestJS backend. Most of the
logic is contained within the backend with the Angular front end acting
just as an interface to the backend. The system workes by having the NestJS
backend serve the compiled Angular front end as a static webpage.

## Environment Variables

The SignLab application can be configured via environment variables. Those
environment variables can be supplied in a number of different ways.

For a complete list of configrations used by the server, refer to the file
`server/src/config/configuration.ts`.

### Locally

Locally, the easiest way to pass in the configuration is via `.env` files.
Below is an example of the usage.

```bash
cd server/
export NODE_ENV=local
npm run start:watch
```

The file `.env.local` in the top level will then be used for configruation.
The server looks for a file `.env.<NODE_ENV>` so additional environments can
be made based on testing needs.

By running `npm run start:watch` at the top level, the application will use the
`.env.local` file.

### Docker

The provided docker-compose file looks for a `deployment.env` file. The
`deployment.env` file is setup identically to a `.env` and is the preferred
method to insert configuration into the dockerized instance.

## Running the Code for Development

The following steps will get you setup so you can test SignLab locally and
test out changes in real time.

1. (One time) Install dependancies

```bash
npm i
```

2. (Each time) Start up a MongoDB instance using the `mongod` command. Below is
an example.

```bash
mongod --dbpath ~/data/signlab
```

3. Start up the frontend and backend

```bash
npm run start:watch
```

The command above will build the Angular and NestJS components and watch
for changes. The commands are run with the "concurrent" package so if reading
the output is difficult, you can run the same command separatly for the
`server` and `client` package in different terminals from the respective
folders.

Note: For the server, you need to specify an `env` file to load.
