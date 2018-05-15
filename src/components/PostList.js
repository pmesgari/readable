import React from 'react';
import PropTypes from 'prop-types';

class PostList extends React.Component {
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }
  render() {
    const { posts } = this.props
    console.log(posts);
    console.log(this.props.posts.isFetching);
    return (
      <span>
      {/* {posts.isFetching === true
        ? <h1>loading</h1>
        : <h1>loaded</h1>
        // : posts.items.map((post) => (
        //   <h1>Title</h1>
        //   ))
      } */}
    </span>
    )
  }
}
// const PostList = (posts) => (
//   <span>
//     {posts.isFetching === true
//       ? <h1>loading</h1>
//       : <h1>loaded</h1>
//       // : posts.items.map((post) => (
//       //   <h1>Title</h1>
//       //   ))
//     }
//   </span>
// )

PostList.propTypes = {
  posts: PropTypes.object.isRequired
};

export default PostList;