import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Picker from '../components/Picker';
import PostList from '../components/PostList';
import Post from '../components/Post';
import { fetchPostsIfNeeded, selectCategory } from '../actions';

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchPostsIfNeeded());
  }
  componentWillReceiveProps(nextProps) {
    console.log('props:' , nextProps)
    const { dispatch, selectedCategory, didInvalidate } = nextProps
    if (nextProps.selectedCategory !== this.props.selectedCategory) {
      dispatch(fetchPostsIfNeeded(selectedCategory))
    }
    if (didInvalidate) {
      dispatch(fetchPostsIfNeeded(selectCategory))
    }
  }
  handleChange = nextCategory => {
    this.props.dispatch(selectCategory(nextCategory))
  }
  render() {
    const { selectedCategory, isFetching, posts } = this.props
    return (
      <div className="App">
        <Route exact path="/" render={({ history }) => {
          return(
            <div>
              <Picker 
                value={selectedCategory}
                onChange={this.handleChange}
                options={['all', 'react', 'redux', 'udacity']} 
              />
              {isFetching && posts.length === 0 && <h2>Loading...</h2>}
              {!isFetching && posts.length !== 0 && <PostList></PostList>}
            </div>
          );}}>
        </Route>
        <Route path="/posts/:category/:id" component={Post} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { selectedCategory, normalizedPosts } = state
  const {
    isFetching,
    didInvalidate,
    lastUpdated,
    allIds: posts
  } = normalizedPosts || 
  {
    isFetching: true,
    allIds: []
  }

  return {
    selectedCategory,
    posts,
    isFetching,
    didInvalidate,
    lastUpdated
  }
}

export default withRouter(connect(mapStateToProps)(App));
