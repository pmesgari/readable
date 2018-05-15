export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';

export const selectCategory = category => ({
    type: SELECT_CATEGORY,
    category
});

export const requestPosts = category => ({
  type: REQUEST_POSTS,
  category
});

export const receivePosts = (category, json) => ({
  type: RECEIVE_POSTS,
  category,
  posts: json,
  receivedAt: Date.now()
});

const fetchPosts = category => dispatch => {
  let url = 'http://localhost:3001';
  url = category === 'all' ? `${url}/posts` : `${url}/${category}/posts`
  dispatch(requestPosts(category))
  return fetch(
    url,
    {
        headers: { 'Authorization': 'whatever-you-want' }
    }
  )
  .then(response => response.json())
  .then(json => {
    dispatch(receivePosts(category, json))
  })
}


const shouldFetchPosts = (state, category) => {
  const posts = state.postsByCategory[category];
  if (!posts) {
    return true;
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate;
}

export const fetchPostsIfNeeded = category => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), category)) {
    return dispatch(fetchPosts(category));
  }
};