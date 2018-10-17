/* @flow strict-local */

import { PureComponent, type ComponentType, type Node } from 'react';
import { connect } from 'react-redux';
import type { JSONAPIResource, JSONAPIResourceIdentifier } from 'json-api';
import { selectResources } from './selectors';

type CommonProps = {|
  children: ({ resources: Array<JSONAPIResource> }) => Node,
|};

type ConnectedProps = {|
  resources: Array<JSONAPIResource>,
  ...CommonProps
|};

type Props = {|
  resourceIds: Array<JSONAPIResourceIdentifier>,
  ...CommonProps
|};

export class DataSet extends PureComponent<ConnectedProps> {
  render() {
    const {
      children,
      resources,
    } = this.props;

    return children({
      resources,
    });
  }
}

const mapStateToProps = (state, props) => ({
  resources: selectResources(state, props),
});

export default (connect(mapStateToProps)(DataSet): ComponentType<Props>);
