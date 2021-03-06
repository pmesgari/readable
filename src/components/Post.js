import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import Modal from 'react-modal';
import uuid from 'uuid';
import * as _ from 'lodash';
import { changeVote, fetchCommentsIfNeeded, removeItem, editItem, addItem, selectSort } from '../actions';

class Post extends React.Component {
  state = {
    newItem: false,
    postModal: false,
    commentModal: false,
    selectedPost: null,
    selectedComment: null
  }
  openPostModal = (post) => {
    this.setState(() => ({ postModal: true, selectedPost: post }))
  }
  closePostModal = () => {
    this.setState(() => ({ postModal: false }))
  }
  openCommentModal = (comment, parentId) => {
    const { postComments } = this.props;
    let commentStruc = {}
    if (postComments.length > 0) {
      commentStruc = Object.keys(postComments[0]).reduce((acc, cur, i) => {
        acc[cur] = '';
        return acc;
      }, {})
    } else {
      commentStruc = {
        id: '',
        parentId: '',
        timestamp: '',
        body: '',
        author: '',
        voteScore: '',
        deleted: '',
        parentDeleted: ''
      }
    }
    commentStruc = { ...commentStruc, id: uuid(), timestamp: Date.now(), parentId: parentId }
    if (comment) {
      this.setState(() => ({ commentModal: true, selectedComment: comment }))
    } else {
      this.setState(() => ({ commentModal: true, selectedComment: commentStruc, editableItem: true, newItem: true }))
    }
  }
  closeCommentModal = () => {
    this.setState(() => ({ commentModal: false, editableItem: false, newItem: false }))
  }
  handlePostChange = (event, key) => {
    let { value } = event.target;
    let updatedPost = { ...this.state.selectedPost, [key]: value }
    this.setState({ selectedPost: updatedPost })
  }
  handleCommentChange = (event, key) => {
    let { value } = event.target;
    let updatedComment = { ...this.state.selectedComment, [key]: value }
    this.setState({ selectedComment: updatedComment });
  }
  changeVote = (upOrDown, type, post) => {
    const { dispatch } = this.props;
    dispatch(changeVote(upOrDown, type, post))
  }
  removeItem = (type, item) => {
    const { dispatch, history } = this.props;
    let redirect = type === 'post' ? '/' : '';
    dispatch(removeItem(type, item));
    if (redirect) {
      history.push(redirect)
    }
  }
  editItem = (type, item) => {
    const { dispatch } = this.props;
    dispatch(editItem(type, item));
  }
  addItem = (type, item) => {
    const { dispatch } = this.props;
    dispatch(addItem(type, item));
  }
  handleSortChange = (item, key, mode) => {
    let { dispatch } = this.props;
    dispatch(selectSort(item, key, mode));
  }
  componentDidMount() {
    const { dispatch, match, post } = this.props;
    if (post) {
      this.setState((prevState) => {return {deleted: false}});
      dispatch(fetchCommentsIfNeeded(match.params.id));
    } else {
      this.setState((prevState) => {return {deleted: !prevState.deleted}});
      console.log('wait');
    }
    
  }
  // shouldComponentUpdate(nextProps) {
  //   console.log(nextProps);
  //   if (!_.isEmpty(nextProps.post)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  render() {
    const { postModal, selectedPost, commentModal, selectedComment, newItem } = this.state;
    const { post, postComments } = this.props;
    return (
      <div className="row">
        {
          <div className="col-12">
            {
              post && !post.deleted &&
              <div className="col-12">
                <div className="col-12">
                  <button type="button" className="btn btn-outline-success" onClick={() => this.handleSortChange('post', 'timestamp', 'desc')}>Sort by date</button>
                  <button type="button" className="btn btn-outline-success" onClick={() => this.handleSortChange('post', 'voteScore', 'desc')}>Sort by score</button>
                </div>
                <br />
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.body}</p>
                    <div className="btn-container">
                      <button type="button" className="btn btn-primary" onClick={() => this.openPostModal(post)}>Edit</button>
                      <button type="button" className="btn btn-danger" onClick={() => this.removeItem('post', post)}>Remove</button>
                      <button type="button" className="btn btn-success" onClick={() => this.openCommentModal('', post.id)}>Add comment</button>
                    </div>
                    <br />
                    <div className="list-group">
                      {postComments &&
                        postComments.map((comment, i) => {
                          if (!comment.deleted) {
                            return (
                              <div key={i} >
                                <div className="card">
                                  <div className="card-body">
                                    <p className="card-text">{comment.body}</p>
                                  </div>
                                  <div className="card-footer text-muted">
                                    <div className="author">Author: {comment.author}</div>
                                    <div className="comment-score">Vote Score: {comment.voteScore}</div>
                                    <div className="comment-timestamp">Timestamp: {new Date(comment.timestamp).toString()}</div>
                                    <div className="btn-container">
                                      <button className="btn btn-outline-success" onClick={() => this.openCommentModal(comment)}>
                                        <i className="fa fa-edit"></i>
                                      </button>
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
                              </div>
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
        }
        <Modal overlayClassName="Overlay" isOpen={commentModal} onRequestClose={this.closeCommentModal} contentLabel='Modal' ariaHideApp={false}>
          {selectedComment &&
            <div>
              <div className="modal-header">
                <h5 className="modal-title">{selectedComment.title}</h5>
                <button type="button" className="close" aria-label="Close" onClick={this.closeCommentModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{selectedComment.body}</p>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="comment-body">Body</span>
                  </div>
                  <textarea value={selectedComment.body} onChange={(event) => this.handleCommentChange(event, 'body')} className="form-control" aria-label="With textarea"></textarea>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="comment-body">Timestamp</span>
                  </div>
                  <input disabled value={Date(selectedComment.timestamp)} onChange={(event) => this.handleCommentChange(event, 'timestamp')} className="form-control" aria-label="With textarea" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.closeCommentModal}>Close</button>
                <button type="button" className="btn btn-primary"
                  onClick={() => newItem ? this.addItem('comment', selectedComment) : this.editItem('comment', selectedComment)}>Save changes</button>
              </div>
            </div>
          }
        </Modal>
        <Modal isOpen={postModal} onRequestClose={this.closePostModal} contentLabel='Modal' overlayClassName='overlay' ariaHideApp={false}>
          {selectedPost &&
            <div>
              <div className="modal-header">
                <h5 className="modal-title">{selectedPost.title}</h5>
                <button type="button" className="close" aria-label="Close" onClick={this.closePostModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{selectedPost.body}</p>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="post-title">Title</span>
                  </div>
                  <input value={selectedPost.title} onChange={(event) => this.handlePostChange(event, 'title')} type="text" className="form-control" placeholder="Username" aria-label="Title" aria-describedby="basic-addon1" />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="post-body">Body</span>
                  </div>
                  <textarea value={selectedPost.body} onChange={(event) => this.handlePostChange(event, 'body')} className="form-control" aria-label="With textarea"></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.closePostModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => this.editItem('post', selectedPost)}>Save changes</button>
              </div>
            </div>
          }
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { match } = ownProps;
  const { normalizedPosts, comments, selectedSort } = state;

  const post = normalizedPosts.byId[match.params.id]
  const commentsByPost = comments.byPost[match.params.id]

  let postComments = []

  if (!_.isEmpty(selectedSort)) {
    if (commentsByPost) {
      postComments = _.orderBy(
        commentsByPost.map(commentId => {
          return comments.byId[commentId];
        }),
        [selectedSort.key],
        [selectedSort.mode]
      )
    }
  } else {
    if (commentsByPost) {
      postComments = commentsByPost.map(commentId => {
        return comments.byId[commentId];
      })
    }
  }

  return {
    post,
    postComments
  }
}

export default withRouter(connect(mapStateToProps)(Post));