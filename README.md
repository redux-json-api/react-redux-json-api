Under development
=================

# react-redux-json-api

- a react component which automatically renders childs depending on returned data
	- i.e. also maintains a state of particular set of resources
	- resources are still kept in a single place, no duplicates
- easy querying
	- just put in the endpoint, e.g. `<Query readFrom="/posts">`
	- easy access to related resources (`posts.comments[n].author.name`)
- clean up unused resources
- better than connect/thunk/request pattern
	- use `Query` as the "container", no need to dispatch actions for API requests
- how to handle ssr?
- refresh original/current request
- load another url

```
<Query>
  Loading = integer (1: initial, 2: pagination)
  Paginate = { fetch: () => mixed, hasAny: boolean };
  Pagination = { next: Paginate, prev: Paginate };
  children: (props: { loading: Loading, error, data, pagination: Pagination })
```

## Usage Example

In the most simple example, you just drop `Query` into your component hierarchy where you need the data. Consider a page that lists all your blog posts, you render a header and footer, and query for the actual posts themselves.

```jsx
import Query from 'react-redux-json-api';
import BlogPost from './BlogPost';

const BlogPosts = () => (
  <article>
    <header>Hello Blog</header>
    <Query endpoint="/blog-posts">
      {({ resources }) => resources.map(post => (
        <section>
          <a href={`/post/${post.id}`}>{post.attributes.title}</a>
        </section>
      ))}
    </Query>
    <footer>&copy; 2018</footer>
  </article>
);
```

### Container/Presenter Pattern

A very popular way to divide responsibilities in React apps is the [container/presenter pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0). This is potentially a very clean pattern to use with our `Query` component if you include this in your container component:

#### `container.js`

```jsx
import Query from 'react-redux-json-api';
import BlogPosts from './presenter';

function Loading() {
  return <div>I'm loading</div>;
}

function Container() {
  return (
    <Query endpoint="/blog-posts">
      {({ loading, resources }) => {
        if (loading) return <Loading />;
	return <BlogPosts posts={resources} />
      }}
    </Query>
  );
}
```

#### `presenter.js`
```jsx
import BlogPost from './BlogPost';

export default function BlogPosts() {
  return (
    <article>
      <header>Hello Blog</header>
      {({ posts }) => posts.map(post => (
        <section>
          <a href={`/post/${post.id}`}>{post.attributes.title}</a>
        </section>
      ))}
      <footer>&copy; 2018</footer>
    </article>
  );
}
```

## Caching

`Query` has the ability to cache the result set of executed requests in memory. The caching strategy is very simple, as the result set is stored in a cache key that corresponds to `links.self` from the json:api body, falling back to the provided `endpoint` if `links.self` is not present.

If you would like to use the caching mechanism it is highly encouraged that `links.self` is a permalink for all cached requests. This is important to avoid overlap or missing resources, see this detailed below. To opt-in set boolean prop `enableCache` on your `Query` instance; `<Query endpoint="..." enableCache />`

### Why Permalinks are Important

Let's use above example with blog posts. When a user initially loads our page, we will request `/blog-posts` to retrieve the latest blog posts. We will also add buttons to go to next and prev pages:

```jsx
<Query endpoint="blog-posts">
  ({ resources, links }) => (
    <>
      <BlogPosts posts={resources} />
      {links.prev && <button onClick={links.next.load}>Prev</button>}
      {links.next && <button onClick={links.next.load}>Next</button>}
    </>
  )
</Query>
```

_Note: This is a naive implementation_

#### Error Prone Response

This is an example response body for above code example, that will be error prone when cached. Let's say a user is vieweing the first page on your website, meanwhile you're creating a new blog post. When the user loads page 2, they will see the last blog post from page 1, on page 2 as well. Not only is this error prone when cached, but it's particularly bad because the result set from the first page is cached and will not refresh to the user.

```json
GET /blog-posts

{
  "links": {
    "self": "/blog-posts",
    "next": "/blog-posts?page=2"
  },
  "data": {
    "...": {}
  }
}
```

#### Good Response

A response that would work well and prevent overlapping resources, uses some form of permalinking to a particular result set:

```json
GET /blog-posts

{
  "links": {
    "self": "/blog-posts?fromTimestamp=1445412480",
    "next": "/blog-posts?fromTimestamp=499165200"
  },
  "data": {
    "...": {}
  }
}
```

In this case `links.self` does not reflect the requested URL, instead the server is set up to provide a link that is guaranteed to return the same result set. In this case the strategy is to use the timestamp of the latest blog post. This makes it a far more reliable key for our caching mechanism. 
