Under development
=================

# redux-json-api-scope

- a react component which automatically renders childs depending on returned data
	- i.e. also maintains a state of particular set of resources
	- resources are still kept in a single place, no duplicates
- easy querying
- clean up unused resources

<Query>
  Loading = integer (1: initial, 2: pagination)
  Paginate = { fetch: () => mixed, hasAny: boolean };
  Pagination = { next: Paginate, prev: Paginate };
  children: (props: { loading: Loading, error, data, pagination: Pagination }
