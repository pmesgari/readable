export const REQUEST_POST = 'REQUEST_POST';
export const RECEIVE_POST = 'RECEIVE_POST';
export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const INVALIDATE_POST = 'INVALIDATE_POST';
export const CHANGE_VOTE_POST = 'CHANGE_VOTE_POST';
export const CHANGE_VOTE_COMMENT = 'CHANGE_VOTE_COMMENT';
export const REQUEST_COMMENTS = 'REQUEST_COMMENTS'
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS'
export const REMOVE_POST = 'REMOVE_POST';
export const REMOVE_COMMENT = 'REMOVE_COMMENT';

const baseUrl = 'http://localhost:3001';

export const selectCategory = category => ({
  type: SELECT_CATEGORY,
  category
});

export const invalidatePost = (selectedCategory) => ({
  type: INVALIDATE_POST,
  selectedCategory
});

export const requestPosts = () => ({
  type: REQUEST_POSTS,
});

export const receivePosts = (json) => ({
  type: RECEIVE_POSTS,
  posts: json,
  receivedAt: Date.now()
});

export const requestComments = () => ({
  type: REQUEST_COMMENTS
})

export const receiveComments = (json, postId) => ({
  type: RECEIVE_COMMENTS,
  postId,
  comments: json
})

export const changePostVote = (json) => ({
  type: CHANGE_VOTE_POST,
  post: json
})

export const changeCommentVote = (json) => ({
  type: CHANGE_VOTE_COMMENT,
  comment: json
})

export const removePost = (post) => ({
  type: REMOVE_POST,
  post: post
})

export const removeComment = (comment) => ({
  type: REMOVE_COMMENT,
  comment: comment
})

const fetchPosts = () => dispatch => {
  let url = `${baseUrl}/posts`
  dispatch(requestPosts())
  return fetch(
    url,
    {
      headers: { 'Authorization': 'x' }
    }
  )
  .then(response => response.json())
  .then(json => {
    console.log(json);
    dispatch(receivePosts(json));
  })
}

const fetchComments = (postId) => dispatch => {
  let url = `${baseUrl}/posts/${postId}/comments`;
  dispatch(requestComments())
  return fetch(
    url,
    {
      headers: { 'Authorization': 'x' }
    }
  )
  .then(response => response.json())
  .then(json => {
    console.log(json);
    dispatch(receiveComments(json, postId));
  })
}

export const changeVote = (upOrDown, type, item) => dispatch => {
  let url = type === 'post' ? `${baseUrl}/posts/${item.id}` : `${baseUrl}/comments/${item.id}`;
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
    type === 'post' ? dispatch(changePostVote(json)) : dispatch(changeCommentVote(json));
  })
}

export const removeItem = (type, item) => dispatch => {
  let url = type === 'post' ? `${baseUrl}/posts/${item.id}` : `${baseUrl}/comments/${item.id}`
  return fetch(
    url,
    {
      headers: { 'Authorization': 'x', 'content-type': 'application/json' },
      method: 'DELETE'      
    }
  )
  .then(response => response.json())
  .then(json => {
    console.log('delete', json);
    type === 'post' ? dispatch(removePost(json)) : dispatch(removeComment(json));
  })
}

const shouldFetchPosts = (state) => {
  const posts = state.normalizedPosts.allIds
  if (posts.length === 0) {
    return true;
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate;
}

const shouldFetchComments = (state) => {
  const comments = state.comments.allIds
  if (comments.length === 0) {
    return true;
  }
  if (comments.isFetching) {
    return false;
  }
  return comments.didInvalidate;
}

export const fetchCommentsIfNeeded = (postId) => (dispatch, getState) => {
  if (shouldFetchComments(getState())) {
    return dispatch(fetchComments(postId));
  }
}

export const fetchPostsIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchPosts(getState())) {
    return dispatch(fetchPosts());
  }
};