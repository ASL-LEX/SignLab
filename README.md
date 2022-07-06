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
and a Hapi backend (stored in `server/` folder). A Dockerfile and Docker
compose file is provided for packing up the application.

The Angular front end is heavily coupled to the Hapi backend. Most of the
logic is contained within the backend with the Angular front end acting
just as an interface to the backend. The system workes by having the Hapi
backend serve the compiled Angular front end as a static webpage.

The Hapi backend is based on a project [Anchor](https://github.com/hicsail/anchor)
which provides a template for a Hapi + MongoDB server. Part of what is included
from Anchor is a system for managing users, user roles, user authentication,
MongoDB data access, static webpage serving, emailing service, and various
other helpful tools. All of these features are build using existing common
tools and just packaged up in a form that is easy to include in any backend.

## Running the Code for Development

The following steps will get you setup so you can test SignLab locally and
test out changes in real time.

1. (One time) Install packages for the client side and the server side.

```bash
cd client
npm install
cd ../server
npm install
```

2. (Each time) Start up a MongoDB instance using the `mongod` command. Below is
an example.

```bash
mongod --dbpath ~/data/signlab
```

3. (One time) Run the first time setup script for the Hapi backend.

```bash
cd server/
node first-time-setup.js
```

4. (Each time) Start the Hapi backend

```bash
cd server/
npm start
```

5. (Each time) Have the Angular code build as changes take place

```bash
cd client/
ng build --watch
```
