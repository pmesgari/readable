import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { changeVote, removeItem } from '../actions';
import '../index.css';

class PostList extends React.Component {
  state = {
    postModal: false,
    selectedPost: null
  }
  openPostModal = (post) => {
    this.setState(() => ({ postModal: true, selectedPost: post }))
  }
  closePostModal = () => {
    this.setState(() => ({ postModal: false }))
  }
  handlePostChange = (event) => {
    let { value } = event.target;
    let updatedPost = { ...this.state.selectedPost, 'body': value }
    this.setState({ selectedPost: updatedPost })
  }
  changeVote = (upOrDown, post) => {
    const { dispatch } = this.props;
    dispatch(changeVote(upOrDown, 'post', post))
  }
  removeItem = (type, item) => {
    const { dispatch } = this.props;
    dispatch(removeItem(type, item));
  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }
  render() {
    const { postModal, selectedPost } = this.state;
    const { posts } = this.props;
    return (
      <div>
        <div className="row">
          {
            posts.map((post, i) => {
              if (!post.deleted) {
                return (
                  <div key={i} className="col-sm-6">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{post.title}</h5>
                        <p className="card-text">{post.body}</p>
                        <div className="btn-container">
                          <Link className="btn btn-success" to={`/posts/${post.category}/${post.id}`}>Details</Link>
                          <button type="button" className="btn btn-primary" onClick={() => this.openPostModal(post)}>Edit</button>
                          <button type="button" className="btn btn-danger" onClick={() => this.removeItem('post', post)}>Remove</button>
                        </div>
                      </div>
                      <div className="card-footer text-muted">
                        <div className="author">Author: {post.author}</div>
                        <div className="comments">Comments: {post.commentCount}</div>
                        <div className="vote-container">
                          <div className="post-score">{post.voteScore}</div>
                          <button className="btn btn-outline-primary" onClick={() => this.changeVote('up', post)}>
                            <i className="fa fa-thumbs-up"></i>
                          </button>
                          <button className="btn btn-outline-danger" onClick={() => this.changeVote('down', post)}>
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
            )
          }
        </div>
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
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  value={selectedPost.body}
                  onChange={this.handlePostChange}></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.closePostModal}>Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          }
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { normalizedPosts, selectedCategory } = state;
  const postsById =
    selectedCategory === 'all' ? normalizedPosts.allIds : normalizedPosts.byCategory[selectedCategory]
  let posts = []
  if (postsById) {
    posts = postsById.map((postId) => {
      return normalizedPosts.byId[postId];
    });
  }

  return {
    posts,
    selectedCategory
  };
}

export default withRouter(connect(mapStateToProps)(PostList));