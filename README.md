Under development
=================

# redux-json-api-scope

- a react component which automatically renders childs depending on returned data
	- i.e. also maintains a state of particular set of resources
	- resources are still kept in a single place, no duplicates
- easy querying
	- just put in the endpoint, e.g. `<Query readFrom="/posts">`
	- easy access to related resources (`posts.comments[n].author.name`)
- clean up unused resources
- better than connect/thunk/request pattern
	- use `Query` as the "container", no need to dispatch actions for API requests

```
<Query>
  Loading = integer (1: initial, 2: pagination)
  Paginate = { fetch: () => mixed, hasAny: boolean };
  Pagination = { next: Paginate, prev: Paginate };
  children: (props: { loading: Loading, error, data, pagination: Pagination })
```

## Usage Example

```js
import Query from 'react-redux-json-api';

const BlogPosts = () => (
  <Query readFrom="/blog-posts">
    {({ resources }) => <ul>{resources.map(post => <li>{post.title}</li>)}</ul>}
  </Query>
);
```
