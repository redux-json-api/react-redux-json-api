/* @flow */
import React from 'react';
import { Provider } from 'react-redux';
import { readEndpoint } from 'redux-json-api';
import { mount, shallow } from 'enzyme';
import { Query } from '../Query';
import { mockStore } from './utils';

let mockReadEndpoint;
let props;

jest.mock('redux-json-api', () => ({
  readEndpoint: jest.fn(() => mockReadEndpoint),
}));

beforeEach(() => {
  props = {
    enableCache: false,
    children: () => <div />,
    dispatch: jest.fn(io => io),
    endpoint: '/posts',
  };

  mockReadEndpoint = Promise.resolve({ body: { data: [] } });
});

afterEach(() => {
  jest.clearAllMocks();
});

it('renders without throwing', () => {
  expect(() => shallow(<Query {...props} />)).not.toThrow();
});

it('mounts without throwing with react-redux Provider supplied', () => {
  expect(() => mount(
    <Provider store={mockStore({})}><Query {...props} /></Provider>,
  )).not.toThrow();
});

it('calls readEndpoint with given path', () => {
  shallow(<Query {...props} />);
  expect(props.dispatch).toHaveBeenCalledWith(readEndpoint(props.endpoint));
});

it('saves ids of returned resources to state', async () => {
  mockReadEndpoint = Promise.resolve({
    body: {
      data: [{ type: 'users', id: '1', attributes: { name: 'Wonderwoman' } }],
    },
  });
  const wrapper = shallow(<Query {...props} />);
  await mockReadEndpoint;
  expect(wrapper.state('resourceIds')).toEqual([{ type: 'users', id: '1' }]);
});

it('updates loading state upon fetch initialization', () => {
  const wrapper = shallow(<Query {...props} />);
  expect(wrapper.state('loading')).toBe(true);
});

it('updates loading state when fetch has succeeded', async () => {
  mockReadEndpoint = Promise.resolve({
    body: { data: { type: 'users', id: '1' } },
  });
  const wrapper = shallow(<Query {...props} />);
  await mockReadEndpoint;
  expect(wrapper.state('loading')).toBe(false);
});

it('updates loading state when fetch fails', async () => {
  mockReadEndpoint = () => Promise.reject(new Error('fail'));
  const wrapper = shallow(<Query {...props} />);
  await mockReadEndpoint;
  expect(wrapper.state('loading')).toBe(false);
});

it('only makes once request for same endpoint when requested more times', async () => {
  mockReadEndpoint = Promise.resolve({
    body: { data: { type: 'users', id: '1' } },
  });
  shallow(<Query {...props} enableCache />);
  await mockReadEndpoint;
  shallow(<Query {...props} enableCache />);
  expect(readEndpoint).toHaveBeenCalledTimes(1);
});

it('cached on links.self if provided', async () => {
  const self = '/users?result-hash=abcdef0123456789';
  mockReadEndpoint = Promise.resolve({
    body: {
      links: {
        self,
      },
      data: { type: 'users', id: '1' },
    },
  });
  shallow(<Query {...props} endpoint="/users" enableCache />);
  await mockReadEndpoint;
  shallow(<Query {...props} endpoint={self} enableCache />);
  expect(readEndpoint).toHaveBeenCalledTimes(1);
});
