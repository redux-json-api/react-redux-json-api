/* @flow strict */

import type { JSONAPIResourceIdentifier } from 'json-api';

type Link = {|
  load: () => void,
|};

export type Links = { [string]: Link };

export type CachedResponse = {|
  links: Links,
  resourceIds: Array<JSONAPIResourceIdentifier>,
|};
