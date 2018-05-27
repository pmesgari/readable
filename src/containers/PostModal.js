import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

class PostModal extends React.Component {
  closePostModal = () => {
    console.log('close');
  }
  handlePostChange = (event) => {
    this.props.handleChange(event.target.value);
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }
  render() {
    const { postModal, selectedPost } = this.props
    return (
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

export default connect(mapStateToProps)(PostModal);