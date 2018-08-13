/* @flow strict */

import { createSelector } from 'reselect';
import type { JSONAPIResourceIdentifier } from 'json-api';

const selectApiScope = state => state.api;

const selectResourceIds = (state, props): Array<JSONAPIResourceIdentifier> => props.resourceIds;

export const selectResources = createSelector(
  [selectApiScope, selectResourceIds],
  (api, resourceIds) => resourceIds.map(resourceId =>
    api[resourceId.type].data.find(resource =>
      resource.id === resourceId.id)),
);
