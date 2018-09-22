/* @flow */
// Add `strict` once Dispatch type is added

import type { JSONAPIResource, JSONAPIResourceIdentifier } from 'json-api';
import React, { type Node, PureComponent } from 'react';
import { connect } from 'react-redux';
import { readEndpoint } from 'redux-json-api';
import DataSet from './DataSet';
import QueryCache from './QueryCache';

export type RenderProp = ({
  error?: Error,
  loading: boolean,
  resources: Array<JSONAPIResource>
}) => Node

type Props = {|
  cacheEnabled: boolean,
  children: RenderProp,
  dispatch: (...any) => any,
  endpoint: string,
|};

type State = {|
  error?: Error,
  loading: boolean,
  resourceIds: Array<JSONAPIResourceIdentifier>,
|};

export class Query extends PureComponent<Props, State> {
  static defaultProps = {
    cacheEnabled: false,
  };

  state = {
    error: undefined,
    loading: false,
    resourceIds: [],
  };

  componentDidMount() {
    const { cacheEnabled, endpoint } = this.props;

    if (!cacheEnabled) {
      this.fetchData(endpoint, cacheEnabled);
      return;
    }

    try {
      QueryCache.getEndpointCache(endpoint);
    } catch (_) {
      this.fetchData(endpoint, cacheEnabled);
    }
  }

  fetchData = async (endpoint: string, cache: boolean = true) => {
    const { dispatch } = this.props;
    this.setState({ loading: true });
    try {
      const { body: { data, links } } = await dispatch(readEndpoint(endpoint));
      const resources = Array.isArray(data) ? data : [data];
      const resourceIds = resources.map(({ id, type }) => ({ id, type }));

      this.setState({
        loading: false,
        resourceIds,
      });

      if (cache) {
        const cacheEndpoint = (links && links.hasOwnProperty('self') && links.self) || endpoint;
        QueryCache.cacheEndpoint(cacheEndpoint, resourceIds);
      }
    } catch (error) {
      this.setState({ error, loading: false });
    }
  };

  render() {
    const { error, loading, resourceIds } = this.state;
    return (
      <DataSet error={error} loading={loading} resourceIds={resourceIds}>
        {this.props.children}
      </DataSet>
    );
  }
}

export default connect()(Query);
