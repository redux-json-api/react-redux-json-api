/* @flow */
import React from 'react';
import { mount } from 'enzyme';
import type { JsonApiResource } from 'json-api';
import DataSet from '../DataSet';

type User = JsonApiResource<'users', {
  name: string
}>;

const createMockUser = (name: string): User => ({
  type: 'users',
  id: '1',
  attributes: {
    name,
  },
});

it('should pass resources to render prop', () => {
  const child = jest.fn(() => <div />);
  const resources: Array<User> = [createMockUser('name')];
  mount(<DataSet resources={resources}>{child}</DataSet>);
  expect(child).toHaveBeenCalledWith({ loading: false, resources });
});

it('should pass loading status to render prop', () => {
  const child = jest.fn(() => <div />);
  mount(<DataSet loading resources={[]}>{child}</DataSet>);
  expect(child).toHaveBeenCalledWith({ loading: true, resources: [] });
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
