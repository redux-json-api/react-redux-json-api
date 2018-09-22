/* @flow strict-local */

import type { JSONAPIResourceIdentifier } from 'json-api';

type ResourceIds = Array<JSONAPIResourceIdentifier>;

export default class QueryCache {
  static cachedEndpoints: Map<string, ResourceIds> = new Map();

  static cacheEndpoint(endpoint: string, resourceIds: ResourceIds) {
    QueryCache.cachedEndpoints.set(endpoint, resourceIds);
  }

  static getEndpointCache(endpoint: string) {
    if (QueryCache.cachedEndpoints.has(endpoint)) {
      return QueryCache.cachedEndpoints.get(endpoint);
    }

    throw new Error('Endpoint not cached');
  }
}
