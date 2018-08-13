/* @flow */
// Add `strict` once Dispatch type is added

import type { JSONAPIResource, JSONAPIResourceIdentifier } from 'json-api';
import React, { type Node, PureComponent } from 'react';
import { connect } from 'react-redux';
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
  resourceIds: Array<JSONAPIResourceIdentifier>,
|};

class Query extends PureComponent<Props, State> {
  state = {
    loading: false,
    resourceIds: [],
  };

  componentDidMount() {
    console.log('componentDidMount');

    this.fetchData();
  }

  fetchData = async () => {
    const { dispatch, endpoint } = this.props;
    this.setState({ loading: true });
    try {
      const { body: { data } } = await dispatch(readEndpoint(endpoint));
      const resources = Array.isArray(data) ? data : [data];
      console.log('resources', resources);

      this.setState({
        loading: false,
        resourceIds: resources.map(({ id, type }) => ({ id, type })),
      });
    } catch (e) {
      console.error(e);

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

export default connect()(Query);
