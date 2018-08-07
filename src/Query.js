/* @flow */

import type { JSONAPIResource } from 'json-api';
import React, { type Node, PureComponent } from 'react';
import { readEndpoint } from 'redux-json-api';
import DataSet from './DataSet';

export type RenderProp = ({
  loading: boolean,
  resources: Array<JSONAPIResource>
}) => Node

type Props = {|
  children: RenderProp,
  dispatch: (...any) => any,
  endpoint: string,
|};

type State = {|
  loading: boolean,
  resourceIds: Array<any>,
|};

class Query extends PureComponent<Props, State> {
  state = {
    loading: false,
    resourceIds: [],
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const { dispatch, endpoint } = this.props;
    this.setState({ loading: true });
    try {
      const { data } = await dispatch(readEndpoint(endpoint));
      const resources = Array.isArray(data) ? data : [data];
      this.setState({
        loading: false,
        resourceIds: resources.map(({ id, type }) => ({ id, type })),
      });
    } catch (e) {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading, resourceIds } = this.state;
    return (
      <DataSet loading={loading} resourceIds={resourceIds}>
        {this.props.children}
      </DataSet>
    );
  }
}

export default Query;
