# Query Creator

[![written in typescript](https://img.shields.io/badge/written%20in-typescript-blue.svg)](https://www.typescriptlang.org) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-yellow.svg)](https://github.com/prettier/prettier) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://facebook.github.io/jest/) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![yarn](https://img.shields.io/badge/maintained%20with-yarn-cc00ff.svg)](https://yarnpkg.com/en/)

The Query Creator is an open source point-and-click interface for querying your event data. It's maintained by the team at [Keen IO](https://keen.io/).

<img width="100%" src="https://user-images.githubusercontent.com/7753369/91156939-fc5aa980-e6c4-11ea-913b-d2984d5a843e.png">

### Install

```ssh
npm install query-creator --save
```

or

```ssh
yarn add query-creator
```

### Translations

The default translations files for application are hosted on `jsdelivr` CDN. You can easily replace the translations by overriding the `loadPath` for files.

```typescript
<QueryCreator
  modalContainer={modalContainer}
  projectId={projectId}
  readKey={readKey}
  masterKey={masterKey}
  host={host}
  onUpdateQuery={this.onUpdateQuery}
  onUpdateChartSettings={this.onUpdateChartSettings}
  translations: {
    backend: {
      loadPath: 'https://cdn.jsdelivr.net/npm/@keen.io/explorer@$VERSION/dist/locales/{{lng}}/{{ns}}.json'
    }
  }
/>
```

### npm scripts

List of useful commands that could be used by developers. Execution in the command-line interface should be prefixed with `yarn` package manager.

| Command    | Description                                          |
| ---------- | ---------------------------------------------------- |
| `lint`     | run linter against current application codebase.     |
| `test`     | run unit tests.                                      |
| `build`    | builds application distribution.                     |
| `prettier` | run code formatter process against current codebase. |

### commit

This project uses [Conventional Commits](https://www.conventionalcommits.org) to enforce common commit standards.

| Command      | Description                        |
| ------------ | ---------------------------------- |
| `npx git-cz` | run commit command line interface. |

