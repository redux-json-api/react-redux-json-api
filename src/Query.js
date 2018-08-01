/* @flow */

import type { JsonApiResource } from 'json-api';
import React, { type Node, PureComponent } from 'react';
import { readEndpoint } from 'redux-json-api';
import DataSet from './DataSet';

export type RenderProp = ({
  loading: boolean,
  resources: Array<JsonApiResource<any>>
}) => Node

type Props = {|
  children: RenderProp,
  dispatch: (...any) => any,
  endpoint: string,
|};

type State = {|
  resourceIds: Array<any>,
|};

class Query extends PureComponent<Props, State> {
  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const { dispatch, endpoint } = this.props;
    try {
      const { data } = await dispatch(readEndpoint(endpoint));
      const resources = Array.isArray(data) ? data : [data];
      this.setState({
        resourceIds: resources.map(({ id, type }) => ({ id, type })),
      });
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  render() {
    return (
      <DataSet resourceIds={this.state.resourceIds}>
        {this.props.children}
      </DataSet>
    );
  }
}

export default Query;
