import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { changeVote, fetchCommentsIfNeeded, removeItem } from '../actions';

class Post extends React.Component {
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }
  changeVote = (upOrDown, type, post) => {
    const { dispatch } = this.props;
    dispatch(changeVote(upOrDown, type, post))
  }
  removeItem = (type, item) => {
    const { dispatch, history } = this.props;
    let redirect = type === 'post' ? '/' : '';
    dispatch(removeItem(type, item));
    if(redirect) {
      history.push(redirect)
    }   
  }
  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(fetchCommentsIfNeeded(match.params.id));
  }
  render() {
    const { post, postComments } = this.props;
    return (
      <div className="row">
        {
          post &&
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.body}</p>
                <div className="btn-container">
                  <button type="button" className="btn btn-primary" onClick={() => this.openPostModal(post)}>Edit</button>
                  <button type="button" className="btn btn-danger" onClick={() => this.removeItem('post', post)}>Remove</button>
                </div>
                <br />
                <div className="list-group">
                  {postComments &&
                    postComments.map((comment, i) => {
                      if (!comment.deleted) {
                        return (
                          <li key={i} className="list-group-item">
                          <div className="card">
                            <div className="card-body">
                              <p className="card-text">{comment.body}</p>
                              <div className="btn-container">
                              </div>
                            </div>
                            <div className="card-footer text-muted">
                              <div className="author">Author: {comment.author}</div>
                              <div className="vote-container">
                                <div className="post-score">{comment.voteScore}</div>
                                <button className="btn btn-outline-danger" onClick={() => this.removeItem('comment', comment)}>
                                  <i className="fa fa-trash"></i>
                                </button>
                                <button className="btn btn-outline-primary" onClick={() => this.changeVote('up', 'comment', comment)}>
                                  <i className="fa fa-thumbs-up"></i>
                                </button>
                                <button className="btn btn-outline-danger" onClick={() => this.changeVote('down', 'comment', comment)}>
                                  <i className="fa fa-thumbs-down"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                        )
                      } else {
                        return false
                      }
                    }
                    )}
                </div>
              </div>
              <div className="card-footer text-muted">
                <div className="author">Author: {post.author}</div>
                <div className="comments">Comments: {post.commentCount}</div>
                <div className="vote-container">
                  <div className="post-score">{post.voteScore}</div>
                  <button className="btn btn-outline-primary" onClick={() => this.changeVote('up', 'post', post)}>
                    <i className="fa fa-thumbs-up"></i>
                  </button>
                  <button className="btn btn-outline-danger" onClick={() => this.changeVote('down', 'post', post)}>
                    <i className="fa fa-thumbs-down"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { match } = ownProps;
  const { normalizedPosts, comments } = state;

  const post = normalizedPosts.byId[match.params.id]
  const commentsByPost = comments.byPost[match.params.id]

  let postComments = []

  if (commentsByPost) {
    postComments = commentsByPost.map(commentId => {
      return comments.byId[commentId];
    })
  }

  return {
    post,
    postComments
  }
}

export default withRouter(connect(mapStateToProps)(Post));