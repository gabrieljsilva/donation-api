## Description

This is an example GraphQL API using NestJS.

The goal of this project is provide scenarios to integrate with libraries that I have been creating.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod

# using docker
$ docker compose up
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Libraries
- Decorated Dataloaders
- Decorated Factory


### Decorated Dataloaders
This library is a wrapper for the `dataloader` library. 
It provides a way to create a dataloader using decorators, like relations.

#### Features
- [x] @Load decorator for OneToOne relations;
- [x] @Load decorator for OneToMany relations;
- [x] Nest.js Module;
- [x] Nest.js Service;
- [x] Simple Configurable cache;
- [ ] @Load decorator for ManyToMany relations;
- [ ] Local dataloader handlers resolution;
- [ ] @CacheStrategy decorator to set up cache in specific resolver fields;

Currently, the Dataloader module only loads the DataloaderHandlers globally, which is not ideal.
A way to load the DataloaderHandlers locally should be considered.

Proposal: In the register method, add a parameter that receives a list of modules to be imported.
These modules should export all the providers that have methods decorated with @DataloaderHandler.
The module should be able to resolve these providers and add them to the DataloaderService.

##### LoadManyToMany
Currently, we do not have a specific decorator to load ManyToMany relationships. 
The idea is to create a decorator that efficiently loads ManyToMany relationships.


### Decorated Factory
This library aims to provide a way to create instances for testing scenarios