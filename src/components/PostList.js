import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { changeVote, removeItem, editItem, addItem, selectCategory } from '../actions';
import Select from 'react-select';
import uuid from 'uuid';
import 'react-select/dist/react-select.css';
import '../index.css';

class PostList extends React.Component {
  state = {
    postCategory: '',
    editableItem: false,
    newItem: false,
    postModal: false,
    selectedPost: null
  }
  openPostModal = (post) => {
    const { posts } = this.props;
    let postStruc = {}
    if(posts.length > 0) {
      postStruc = Object.keys(posts[0]).reduce((acc, cur, i) => {
        acc[cur] = '';
        return acc;
      }, {})
    } else {
      postStruc = {
        id: '',
        timestamp: '',
        title: '',
        body: '',
        author: '',
        category: '',
        voteScore: '',
        deleted: '',
        commentCount: ''
      }
    }
    postStruc = {...postStruc, id: uuid(), timestamp: Date.now(), category: this.state.postCategory}
    if (post) {
      this.setState(() => ({ postModal: true, selectedPost: post }))
    } else {
      this.setState(() => ({ postModal: true, selectedPost: postStruc, editableItem: true, newItem: true }))
    }

  }
  closePostModal = () => {
    this.setState(() => ({ postModal: false, editableItem: false, newItem: false }))
  }
  handleCategoryChange = (selectedOption) => {
    this.setState(() => ({ postCategory: selectedOption, selectedPost: {...this.state.selectedPost, category: selectedOption.value} }))
  }
  handlePostChange = (event, key) => {
    let { value } = event.target;
    let updatedPost = { ...this.state.selectedPost, [key]: value }
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
  editItem = (type, item) => {
    const { dispatch } = this.props;
    dispatch(editItem(type, item));
  }
  addItem = (type, item) => {
    const { dispatch } = this.props;
    dispatch(addItem(type, item));
  }
  componentWillMount() {
    if (this.props.match.params.category) {
      this.props.dispatch(selectCategory(this.props.match.params.category))
    } else {
      this.props.dispatch(selectCategory('all'))
    }
  }
  render() {
    const { postModal, selectedPost, editableItem, newItem, postCategory } = this.state;
    const { posts } = this.props;
    return (
      <div>
        <div className="row justify-content-end">
          <div className="col-2">
            <button type="button" className="btn btn-success" onClick={() => this.openPostModal()}>Add Post</button>
          </div>
        </div>
        <br />
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
          {
            selectedPost &&
            <div>
              <div className="modal-header">
                <h5 className="modal-title">{selectedPost.title}</h5>
                <button type="button" className="close" aria-label="Close" onClick={this.closePostModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{selectedPost.body}</p>
                {newItem &&
                  <Select
                    name="form-field-name"
                    value={postCategory}
                    disabled={!editableItem}
                    onChange={this.handleCategoryChange}
                    options={[
                      { value: 'react', label: 'react' },
                      { value: 'redux', label: 'redux' },
                      { value: 'udacity', label: 'udacity' }
                    ]}
                  />
                }
                <br/>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="post-title">Title</span>
                  </div>
                  <input value={selectedPost.title} onChange={(event) => this.handlePostChange(event, 'title')} type="text" className="form-control" placeholder="Title" aria-label="Title" aria-describedby="basic-addon1" />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="post-body">Body</span>
                  </div>
                  <textarea value={selectedPost.body} onChange={(event) => this.handlePostChange(event, 'body')} className="form-control" aria-label="With textarea"></textarea>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="post-author">Author</span>
                  </div>
                  <input disabled={!editableItem} value={selectedPost.author} onChange={(event) => this.handlePostChange(event, 'author')} type="text" className="form-control" placeholder="Author" aria-label="Author" aria-describedby="basic-addon1" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.closePostModal}>Close</button>
                <button type="button" className="btn btn-primary" 
                  onClick={() => newItem ? this.addItem('post', selectedPost) : this.editItem('post', selectedPost)}
                >Save changes</button>
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