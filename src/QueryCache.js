/* @flow strict-local */

import type { CachedResponse } from './types';

export default class QueryCache {
  static cachedEndpoints: Map<string, CachedResponse> = new Map();

  static cacheEndpoint(endpoint: string, response: CachedResponse) {
    QueryCache.cachedEndpoints.set(endpoint, response);
  }

  static getEndpointCache(endpoint: string) {
    if (QueryCache.cachedEndpoints.has(endpoint)) {
      return QueryCache.cachedEndpoints.get(endpoint);
    }

    throw new Error('Endpoint not cached');
  }
}
