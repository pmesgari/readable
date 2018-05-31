import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Picker from '../components/Picker';
import PostList from '../components/PostList';
import Post from '../components/Post';
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
        <Route path="/posts/:id" component={Post} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { selectedCategory, postsByCategory } = state
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsByCategory[selectedCategory] || 
  {
    isFetching: true,
    items: []
  }
  return {
    selectedCategory,
    posts,
    isFetching,
    lastUpdated
  }
}

export default withRouter(connect(mapStateToProps)(App));
