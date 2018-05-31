import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

class Post extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <h1>Post Detail Page</h1>
        <h3>ID: {match.params.id}</h3>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return ({})
}

export default withRouter(connect(mapStateToProps)(Post));