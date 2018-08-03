/* @flow */

import { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { JSONAPIResource, JSONAPIResourceIdentifier } from 'json-api';
import type { RenderProp } from './Query';
import { selectResources } from './selectors';

type Props = {
  children: RenderProp,
  loading: boolean,
  resources: Array<JSONAPIResource>
};

export class DataSet extends PureComponent<Props> {
  static defaultProps = {
    loading: false,
  };

  render() {
    const { children, loading, resources } = this.props;
    return children({
      loading,
      resources,
    });
  }
}

const mapStateToProps = (state, props) => ({
  resources: selectResources(state, props),
});

export default connect(mapStateToProps)(DataSet);
