import { combineReducers } from 'redux';
import { 
  SELECT_CATEGORY,
  REQUEST_POSTS,
  RECEIVE_POSTS,
  CHANGE_VOTE_POST,
  CHANGE_VOTE_COMMENT,
  REQUEST_COMMENTS,
  RECEIVE_COMMENTS,
  REMOVE_COMMENT,
  REMOVE_POST,
  EDIT_POST,
  EDIT_COMMENT,
  ADD_POST,
  ADD_COMMENT,
  SELECT_SORT
} from '../actions';

const selectedCategory = (state = 'all', action) => {
  switch (action.type) {
    case SELECT_CATEGORY:
      return action.category;
    default:
      return state
  }
};

const selectedSort = (state = {}, action) => {
  switch (action.type) {
    case SELECT_SORT:
      return {
        ...state,
        item: action.item,
        key: action.key,
        mode: action.mode
      }
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
        byId: action.posts.reduce((acc, cur, i) => {
          acc[cur.id] = cur;
          return acc;
        }, {}),
        byCategory: action.posts.reduce((acc, cur, i) => {
          if(acc[cur.category] === cur.category) {
            acc[cur.category].push(cur.id)
          } else {
            if(acc[cur.category]) {
              acc[cur.category].push(cur.id);
            } else {
              acc[cur.category] = []
              acc[cur.category].push(cur.id);
            }
            
          }
          return acc;
        }, {}),
        allIds: action.posts.reduce((acc, cur, i) => {
          acc.push(cur.id);
          return acc;
        }, [])
      }
    case CHANGE_VOTE_POST:
      return {
        ...state,
        byId: {...state["byId"], [action.post.id]: action.post}
      }
    case REMOVE_POST:
      return {
        ...state,
        byId: {...state["byId"], [action.post.id]: {...state.byId[action.post.id], deleted: true}}
      }
    case EDIT_POST:
      return {
        ...state,
        byId: {...state["byId"], [action.post.id]: action.post}
      }
    case ADD_POST:
      return {
        ...state,
        didInvalidate: true,
        byId: {...state["byId"], [action.post.id]: action.post}
      }
    default:
      return state;
  }
}

export const comments = (state = {
  byId: {},
  byPost: {},
  allIds: []
}, action) => {
  switch (action.type) {
    case REQUEST_COMMENTS:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_COMMENTS:
      return {
        ...state,
        isFetching: false,
        byId: action.comments.reduce((acc, cur, i) => {
          acc[cur.id] = cur;
          return acc;
        }, state.byId),
        byPost: {...state['byPost'], [action.postId]: action.comments.map( comment => comment.id)}
      }
    case CHANGE_VOTE_COMMENT:
      return {
        ...state,
        byId: {...state["byId"], [action.comment.id]: action.comment}
      }
    case REMOVE_COMMENT:
      return {
        ...state,
        byId: {...state["byId"], [action.comment.id]: {...state.byId[action.comment.id], deleted: true}}
      }
    case EDIT_COMMENT:
      return {
        ...state,
        byId: {...state["byId"], [action.comment.id]: action.comment}
      }
    case ADD_COMMENT:
      return {
        ...state,
        didInvalidate: true,
        byId: {...state["byId"], [action.comment.id]: action.comment},
        byPost: {...state['byPost'], [action.comment.parentId]: [...state.byPost[action.comment.parentId], action.comment.id] }
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  normalizedPosts,
  comments,
  selectedCategory,
  selectedSort
});

export default rootReducer;