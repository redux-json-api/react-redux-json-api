/* @flow */

import { PureComponent } from 'react';
import type { JsonApiResource } from 'json-api';
import type { RenderProp } from './Query';

type Props = {
  children: RenderProp,
  loading: boolean,
  resources: Array<JsonApiResource<any>>
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

export default DataSet;
