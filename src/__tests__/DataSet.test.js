/* @flow */
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import type { JSONAPIResource } from 'json-api';
import ConnectedDataSet, { DataSet } from '../DataSet';
import { mockStore } from './utils';

let mockResources;
jest.mock('../selectors', () => ({
  selectResources: () => mockResources,
}));

const createMockUser = (name: string): JSONAPIResource => ({
  type: 'users',
  id: '1',
  attributes: {
    name,
  },
});

beforeEach(() => {
  mockResources = undefined;
});

it('should pass specified resource to render prop', () => {
  const child = jest.fn(() => <div />);
  const resources = [createMockUser('Line')];
  mockResources = resources;
  mount(
    <Provider store={mockStore({})}>
      <ConnectedDataSet
        resourceIds={resources.map(({ id, type }) => ({ id, type }))}
      >
        {child}
      </ConnectedDataSet>
    </Provider>,
  );
  expect(child).toHaveBeenCalledWith({ resources });
});

it('should pass resources to render prop', () => {
  const child = jest.fn(() => <div />);
  const resources: Array<JSONAPIResource> = [createMockUser('name')];
  mount(<DataSet resources={resources}>{child}</DataSet>);
  expect(child).toHaveBeenCalledWith({ resources });
});

it('should pass loading status to render prop', () => {
  const child = jest.fn(() => <div />);
  mount(<DataSet resources={[]}>{child}</DataSet>);
  expect(child).toHaveBeenCalledWith({ resources: [] });
});

// `Query` calls `readEndpoint`
// Saves resource ids in component state
// Passes full resources to render prop

// ================

// Props = {
//   loadResources: (endpoint) => Promise<JsonApiDocument>
// }

// State = {
//   rootResources: Array<JsonApiResource>
// }

// Query<Props, State>

// ================

// Props = {
//   resourceIds: Array<JsonApiResourceId>
// }

// ConnectedProps = {
//   resources: Array<JsonApiResource>
// }

// DataSet<ConnectedProps>
