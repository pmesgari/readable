export const REQUEST_POSTS_BY_CATEGORY = 'REQUEST_POSTS_BY_CATEGORY';
export const RECEIVE_POSTS_BY_CATEGORY = 'RECEIVE_POSTS_BY_CATEGORY';
export const REQUEST_POST = 'REQUEST_POST';
export const RECEIVE_POST = 'RECEIVE_POST';
export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const INVALIDATE_POST = 'INVALIDATE_POST';
export const CHANGE_VOTE_POST = 'CHANGE_VOTE_POST';

const baseUrl = 'http://localhost:3001';

export const requestPostsByCategory = category => ({
  type: REQUEST_POSTS_BY_CATEGORY,
  category
});

export const receivePostsByCategory = (category, json) => ({
  type: RECEIVE_POSTS_BY_CATEGORY,
  category,
  posts: json
})

export const selectCategory = category => ({
  type: SELECT_CATEGORY,
  category
});

export const invalidatePost = (selectedCategory) => ({
  type: INVALIDATE_POST,
  selectedCategory
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

export const changeVotePost = (selectedCategory, json) => ({
  type: CHANGE_VOTE_POST,
  selectedCategory,
  post: json
})

const fetchPosts = category => dispatch => {
  let url = category === 'all' ? `${baseUrl}/posts` : `${baseUrl}/${category}/posts`
  dispatch(requestPosts(category))
  return fetch(
    url,
    {
      headers: { 'Authorization': 'x' }
    }
  )
  .then(response => response.json())
  .then(json => {
    console.log("response", json);
    dispatch(receivePosts(category, json));
    dispatch(receivePostsByCategory(category, json));
  })
}

export const changeVote = (upOrDown, selectedCategory, post) => dispatch => {
  let url = `${baseUrl}/posts/${post.id}`;
  let option = upOrDown === 'up' ? 'upVote' : 'downVote';
  return fetch(
    url,
    {
      body: JSON.stringify({"option": option}),
      headers: { 'Authorization': 'x', 'content-type': 'application/json' },
      method: 'POST'
    }
  )
  .then(response => response.json())
  .then(json => {
    console.log("response", json);
    dispatch(changeVotePost(selectedCategory, json));
  })
}

const shouldFetchPosts = (state, category) => {
  // const posts = state.postsByCategory[category];
  const posts = state.normalizedPosts.byCategory[category]
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