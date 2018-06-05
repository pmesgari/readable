import React, { Component } from 'react';
import { Route, withRouter, Link, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import Picker from '../components/Picker';
import PostList from '../components/PostList';
import Post from '../components/Post';
import { fetchPostsIfNeeded, selectCategory } from '../actions';
import '../index.css';
import PageNotFound from '../components/PageNotFound';

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
        <div className="nav-links">
          <Link className="btn btn-outline-info" onClick={() => this.handleChange('all')} to={'/'}>Home</Link>
          <Link className="btn btn-outline-info" onClick={() => this.handleChange('react')} to={'/react'}>React</Link>
          <Link className="btn btn-outline-info" onClick={() => this.handleChange('redux')} to={'/redux'}>Redux</Link>
          <Link className="btn btn-outline-info" onClick={() => this.handleChange('udacity')} to={'/udacity'}>Udacity</Link>
        </div>
          <Switch>
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
            <Route exact path="/:category" render={() => {
              return(
                <div>
                  {isFetching && posts.length === 0 && <h2>Loading...</h2>}
                  {!isFetching && posts.length !== 0 && <PostList></PostList>}
                </div>
              )
            }}/>
            <Route exact path="/posts/:category/:id" component={({ match }) => {
              if (!isFetching) {
                if (posts.includes(match.params.id)) {
                  return(
                    <div>
                      <Post></Post>
                    </div>
                  )
                } else {
                  return(
                    <div>
                      <PageNotFound></PageNotFound>
                    </div>
                  )
                }
              } else {
                return(
                  <div>is Loading</div>
                )
              }
            }} />
            <Route component={PageNotFound}></Route>
          </Switch>
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
