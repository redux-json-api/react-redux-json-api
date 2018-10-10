/* @flow strict-local */

import type { StoredResponse } from './Query';

export default class QueryCache {
  static cachedEndpoints: Map<string, StoredResponse> = new Map();

  static cacheEndpoint(endpoint: string, response: StoredResponse) {
    QueryCache.cachedEndpoints.set(endpoint, response);
  }

  static getEndpointCache(endpoint: string) {
    if (QueryCache.cachedEndpoints.has(endpoint)) {
      return QueryCache.cachedEndpoints.get(endpoint);
    }

    throw new Error('Endpoint not cached');
  }
}
