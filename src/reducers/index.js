import { combineReducers } from 'redux';
import { 
  SELECT_CATEGORY,
  INVALIDATE_POST,
  REQUEST_POSTS,
  RECEIVE_POSTS,
  CHANGE_VOTE_POST
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
  postsByCategory,
  selectedCategory
});

export default rootReducer;