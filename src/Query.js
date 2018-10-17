/* @flow */
// Add `strict` once Dispatch type is added

import type { JSONAPIResource, JSONAPIResourceIdentifier } from 'json-api';
import React, { type Node, PureComponent } from 'react';
import { connect } from 'react-redux';
import { readEndpoint } from 'redux-json-api';
import DataSet from './DataSet';
import QueryCache from './QueryCache';

type Link = {|
  load: () => void,
|};

type Links = { [string]: Link };

type Refetch = () => void;

export type StoredResponse = {|
  links: Links,
  resourceIds: Array<JSONAPIResourceIdentifier>,
|};

type RenderProp = ({
  error?: Error,
  loading: boolean,
  links: Links,
  refetch: Refetch,
  resources: Array<JSONAPIResource>
}) => Node

type Props = {|
  children: RenderProp,
  dispatch: (...any) => any,
  enableCache: boolean,
  endpoint: string,
|};

type State = {|
  error?: Error,
  loading: boolean,
  ...StoredResponse,
|};

export class Query extends PureComponent<Props, State> {
  static defaultProps = {
    enableCache: false,
  };

  state = {
    error: undefined,
    loading: false,
    links: {},
    resourceIds: [],
  };

  componentDidMount() {
    this.loadEndpoint(this.props.endpoint);
  }

  setResponse = ({ resourceIds, links }: StoredResponse) => {
    this.setState({
      resourceIds,
      links,
    });
  };

  createLinksObject = (links: { [string]: string }) => (
    Object.keys(links).filter(link => link !== 'self').reduce(
      (carry, link) => Object.assign({
        [link]: {
          load: () => this.loadEndpoint(links[link]),
        },
      }, carry),
      {},
    )
  );

  loadEndpoint = (
    endpoint: string,
    enableCache: boolean = this.props.enableCache,
  ) => {
    if (!enableCache) {
      this.fetchData(endpoint, enableCache);
      return;
    }

    try {
      this.setResponse(QueryCache.getEndpointCache(endpoint));
    } catch (_) {
      this.fetchData(endpoint, enableCache);
    }
  };

  fetchData = async (
    endpoint: string,
    enableCache: boolean = this.props.enableCache,
  ) => {
    const { dispatch } = this.props;
    this.setState({ loading: true });
    try {
      const { body: { data, links } } = await dispatch(readEndpoint(endpoint));
      const resources = Array.isArray(data) ? data : [data];
      const resourceIds = resources.map(({ id, type }) => ({ id, type }));

      this.setState({
        loading: false,
      });

      const response = {
        resourceIds,
        links: links ? this.createLinksObject(links) : {},
      };

      this.setResponse(response);

      if (enableCache) {
        const cacheEndpoint = (links && links.hasOwnProperty('self') && links.self) || endpoint;
        QueryCache.cacheEndpoint(cacheEndpoint, response);
      }
    } catch (error) {
      this.setState({ error, loading: false });
    }
  };

  refetch = () => {
    this.fetchData(this.props.endpoint);
  };

  render() {
    const {
      error,
      loading,
      links,
      resourceIds,
    } = this.state;

    return (
      <DataSet resourceIds={resourceIds}>
        {({ resources }) => this.props.children({
          error,
          loading,
          links,
          refetch: this.refetch,
          resources,
        })}
      </DataSet>
    );
  }
}

export default connect()(Query);
