import React from 'react';
import PropTypes from 'prop-types';

const PostList = (posts) => (
  <span>
    {posts.map((post) => (
      <h1>post title</h1>
    ))}
  </span>
)

PostList.propTypes = {
  posts: PropTypes.object
};

export default PostList;