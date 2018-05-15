import React, { Component } from 'react';
import { connect } from 'react-redux'
import Picker from '../components/Picker';
import PostList from '../components/PostList';
import { fetchPostsIfNeeded, selectCategory } from '../actions';

class App extends Component {
  componentDidMount() {
    const { dispatch, selectedCategory } = this.props;
    dispatch(fetchPostsIfNeeded(selectedCategory));
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCategory !== this.props.selectedCategory) {
      const { dispatch, selectedCategory } = nextProps
      dispatch(fetchPostsIfNeeded(selectedCategory))
    }
  }
  handleChange = nextCategory => {
    this.props.dispatch(selectCategory(nextCategory))
  }
  render() {
    const { selectedCategory } = this.props
    return (
      <div className="App">
        <Picker value={selectedCategory}
          onChange={this.handleChange}
          options={['all', 'react', 'redux', 'udacity']} />
          <PostList></PostList>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { selectedCategory } = state;
  return {
    selectedCategory
  };
}

export default connect(mapStateToProps)(App);
