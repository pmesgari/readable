import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

class PostList extends React.Component {
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }
  render() {
    const { postsByCategory, selectedCategory } = this.props
    return (
      <span>
        {postsByCategory[selectedCategory].items.map((post) => (
          <h1>{post.title}</h1>
        ))}
      </span>
    )
  }
}

PostList.propTypes = {
  posts: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { postsByCategory, selectedCategory } = state;
  return {
    postsByCategory,
    selectedCategory
  };
}

export default connect(mapStateToProps)(PostList);