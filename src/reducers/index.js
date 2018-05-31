import { combineReducers } from 'redux';
import { 
  SELECT_CATEGORY,
  INVALIDATE_POST,
  REQUEST_POSTS,
  RECEIVE_POSTS,
  CHANGE_VOTE_POST,
  REQUEST_POSTS_BY_CATEGORY,
  RECEIVE_POSTS_BY_CATEGORY,
  REQUEST_POST,
  RECEIVE_POST
} from '../actions';

const selectedCategory = (state = 'all', action) => {
  switch (action.type) {
    case SELECT_CATEGORY:
      return action.category;
    default:
      return state
  }
};

const posts = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case INVALIDATE_POST:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_POSTS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      }
    case CHANGE_VOTE_POST:
      return Object.assign({}, state, {
        'items': state.items.map((item) => item.id === action.post.id ? action.post : item
        )
      })
    default:
      return state
  }
}

export const normalizedPosts = (state = {
  byId: {},
  byCategory: {},
  allIds: []
}, action) => {
  switch (action.type) {
    case REQUEST_POSTS_BY_CATEGORY:
      return {
        ...state,
        [action.selectedCategory]: {}
      }
    case RECEIVE_POSTS_BY_CATEGORY:
      return {
        ...state,
        'byCategory': {...state['byCategory'], [action.category]: action.posts.reduce((acc, cur, i) => {
          acc[cur.id] = cur
          return acc;
        }, {})}
      }
    case REQUEST_POST:
    case RECEIVE_POST:
    default:
      return state;

  }
}

const postsByCategory = (state = {}, action) => {
  switch (action.type) {
    case INVALIDATE_POST:
      return {
        ...state,
        [action.selectedCategory]: posts(state[selectedCategory], action)
      }
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return {
        ...state,
        [action.category]: posts(state[action.category], action)
      }
    case CHANGE_VOTE_POST:
      return {
        ...state,
        [action.selectedCategory]: posts(state[action.selectedCategory], action)
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  normalizedPosts,
  postsByCategory,
  selectedCategory
});

export default rootReducer;