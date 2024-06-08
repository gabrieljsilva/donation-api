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
- [ ] Local dataloader handlers resolution;
- [ ] @CacheStrategy decorator to set up cache in specific resolver fields;

Currently, the Dataloader module only loads the DataloaderHandlers globally, which is not ideal.
A way to load the DataloaderHandlers locally should be considered.

Proposal: In the register method, add a parameter that receives a list of modules to be imported.
These modules should export all the providers that have methods decorated with @DataloaderHandler.
The module should be able to resolve these providers and add them to the DataloaderService.

### Decorated Factory
This library aims to provide a way to create instances for testing scenarios


### Cenários Ideais
````typescript
// SCENARIO 1 = 1:1
class User {
  id: number;
  name: string;
  accessId: number;

  @LoadOne(() => Access, { by: 'accessId', where: 'id', on: 'LOAD_ACCESS_BY_ID' })
  access: Access;
}

class Access {
  id: number;
  title: string;

  @LoadOne(() => User, { by: 'id', where: 'accessId', on: 'LOAD_USERS_BY_ACCESS_IDS' })
  user: User;
}

// SCENARIO 2 = 1:N
class Donor {
  id: number;
  name: string;

  @LoadMany(() => Donation, { by: 'id', where: 'donorId', on: 'LOAD_DONATIONS_BY_DONOR_IDS' })
  donations: Donation[];
}

class Donation {
  id: number;
  amount: number;
  donorId: number;

  @LoadOne(() => Donor, { by: 'donorId', where: 'id', on: 'LOAD_DONOR_BY_ID' })
  donor: Donor;
}

// SCENARIO 3 = N:N
class Photo {
  id: number;
  url: string;

  @LoadMany(() => Category, { by: 'id', where: 'photoId', on: 'LOAD_CATEGORIES_BY_PHOTO_IDS' })
  @LoadThrough(() => PhotoCategory, { joinProperty: 'photoCategory' })
  categories: Category[];
}

class Category {
  id: string;
  name: string;

  @LoadMany(() => Photo, { by: 'id', where: 'categoryId', on: 'LOAD_PHOTOS_BY_CATEGORY_IDS' })
  @LoadThrough(() => PhotoCategory, { joinProperty: 'photoCategory' })
  photos: Photo[];
}

class PhotoCategory {
  photoId: number;
  categoryId: string;
}

const metadata = {
  relations: {
    USER: {
      ACCESS: {
        access: {
          type: 'OneToOne',
          by: 'accessId',
          where: 'id'
        }
      },
    },
    ACCESS: {
      USER: { 
        user: {
          type: 'OneToOne',
          by: 'id',
          where: 'accessId'
        }
      },
    },
    DONOR: {
      DONATION: {
        donations: {
          type: 'OneToMany',
          by: 'id',
          where: 'donorId',
          through: null
        }
      },
    },
    DONATION: {
      DONOR: { 
        donor: {
          type: 'OneToOne',
          by: 'donorId', 
          where: 'id'
        }
      },
    },
    PHOTO: {
      CATEGORY: {
        categories: {
          type: 'ManyToMany',
          by: 'id',
          where: 'photoId',
          through: 'PhotoCategory',
          joinProperty: 'photoCategory',
        }
      },
    },
    CATEGORY: {
      PHOTO: {
        photos: {
          type: 'ManyToMany',
          by: 'id',
          where: 'categoryId',
          through: 'PhotoCategory',
          joinProperty: 'photoCategory',
        }
      },
    },
  },
};

````