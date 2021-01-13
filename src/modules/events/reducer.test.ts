import { initialState, eventsReducer } from './reducer';

import {
  setEventsCollections,
  computeSchemaSuccess,
  setCollectionSchemaLoading,
  fetchCollectionSchemaSuccess,
} from './actions';

test('set evetns collections', () => {
  const eventsCollections = ['logins', 'purchases'];
  const action = setEventsCollections(eventsCollections);

  const { collections } = eventsReducer(initialState, action);

  expect(collections).toEqual(eventsCollections);
});

test('set collection schema loading state', () => {
  const action = setCollectionSchemaLoading('purchases', true);
  const { loadingSchemas } = eventsReducer(initialState, action);

  expect(loadingSchemas).toMatchInlineSnapshot(`
    Array [
      "purchases",
    ]
  `);
});

test('removes collection schema loading state', () => {
  const action = setCollectionSchemaLoading('purchases', false);
  const { loadingSchemas } = eventsReducer(
    {
      ...initialState,
      loadingSchemas: ['logins', 'purchases'],
    },
    action
  );

  expect(loadingSchemas).toMatchInlineSnapshot(`
    Array [
      "logins",
    ]
  `);
});

test('creates structure for fetched collection', () => {
  const schema = {
    name: 'string',
    age: 'number',
  };
  const action = fetchCollectionSchemaSuccess('logins', schema);
  const { schemas } = eventsReducer(initialState, action);

  expect(schemas).toMatchInlineSnapshot(`
    Object {
      "logins": Object {
        "list": Object {},
        "schema": Object {
          "age": "number",
          "name": "string",
        },
        "tree": Object {},
      },
    }
  `);
});

test('updates schema structure', () => {
  const schema = {
    list: [{ path: 'name', type: 'string' }],
    tree: {
      name: ['name', 'string'],
    },
  };

  const action = computeSchemaSuccess('logins', schema);
  const { schemas } = eventsReducer(
    {
      ...initialState,
      schemas: {
        logins: {
          schema: { name: 'string' },
          list: [],
          tree: {},
        },
      },
    },
    action
  );

  expect(schemas).toMatchInlineSnapshot(`
    Object {
      "logins": Object {
        "list": Array [
          Object {
            "path": "name",
            "type": "string",
          },
        ],
        "schema": Object {
          "name": "string",
        },
        "tree": Object {
          "name": Array [
            "name",
            "string",
          ],
        },
      },
    }
  `);
});
