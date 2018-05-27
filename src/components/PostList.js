import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import Modal from 'react-modal';
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
    let updatedPost = {...this.state.selectedPost, 'body': value}
    this.setState({selectedPost: updatedPost})
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }
  render() {
    const { postModal, selectedPost } = this.state;
    const { postsByCategory, selectedCategory } = this.props;
    return (
      <div>
        <div className="row">
          {
            postsByCategory[selectedCategory].items.map((post, i) =>
              <div key={i} className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.body}</p>
                    <div className="btn-container">
                      <Link className="btn btn-primary" to="/modus-create">Modus Create</Link>
                      <button type="button" className="btn btn-primary" onClick={() => this.openPostModal(post)}>Details</button>
                      <button type="button" className="btn btn-success">Edit</button>
                      <button type="button" className="btn btn-danger">Remove</button>
                    </div>
                  </div>
                  <div className="card-footer text-muted">
                    <div className="vote-container">
                      <div className="post-score">{post.voteScore}</div>
                      <i className="fa fa-thumbs-up"></i>
                      <i className="fa fa-thumbs-down"></i>
                    </div>
                  </div>
                </div>
              </div>
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
  const { postsByCategory, selectedCategory } = state;
  return {
    postsByCategory,
    selectedCategory
  };
}

export default withRouter(connect(mapStateToProps)(PostList));