/* @flow */
import React from 'react';
import { readEndpoint } from 'redux-json-api';
import { mount, shallow } from 'enzyme';
import Query from '../Query';

let mockReadEndpoint;
let props;

jest.mock('redux-json-api', () => ({
  readEndpoint: jest.fn(() => mockReadEndpoint),
}));

beforeEach(() => {
  props = {
    dispatch: jest.fn(io => io),
    endpoint: '/posts',
  };

  mockReadEndpoint = Promise.resolve({ data: [] });
});

it('renders without throwing', () => {
  expect(() => shallow(<Query {...props} />)).not.toThrow();
});

it('calls readEndpoint with given path', () => {
  mount(<Query {...props} />);
  expect(props.dispatch).toHaveBeenCalledWith(readEndpoint(props.endpoint));
});

it('saves ids of returned resources to state', () => {
  mockReadEndpoint = Promise.resolve({
    data: [
      { type: 'users', id: '1', attributes: { name: 'Wonderwoman' } },
    ],
  });
  const wrapper = mount(<Query {...props} />);
  setTimeout(() => {
    expect(wrapper.state.resourceIds).toEqual([{ type: 'users', id: '1' }]);
  }, 1);
});
