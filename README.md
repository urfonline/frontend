# frontend
***for urfonline.com***

A [TypeScript](https://www.typescriptlang.org/) [React](https://reactjs.org/) application with [Emotion](https://emotion.sh)-based styling.


## Getting started

This will you get the frontend application running on your machine for development.


### Prerequisites

You'll need [Node.js](https://nodejs.org), and the package manager [Yarn](https://yarnpkg.com/).

It's recommend to use [nvm](https://github.com/creationix/nvm). This will allow you to use multiple versions of Node.js on your machine.

### Running instructions

```
$ git clone git@github.com:urfonline/frontend.git
$ cd frontend
$ yarn prep
$ yarn serve
```

This will start the dev server on port 8080: [http://localhost:8080](http://localhost:8080). 

### Commands

#### `yarn prep`
This runs any required scripts before a build can take place.

Currently it:

- runs scripts/getFragmentTypes.js; getting graphql schema data from the production server

#### `yarn serve`
Starts a development server on port 8080: [http://localhost:8080](http://localhost:8080).

#### `yarn format`
Runs [Prettier](https://prettier.io/) to deterministically format all source files.

#### `yarn test`
Runs all tests via Jest.


#### `yarn prod`
The entire production build.

- Gets fragmentTypes
- Builds
- Generates light static render files
