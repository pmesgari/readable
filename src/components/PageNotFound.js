import React from 'react';

class PageNotFound extends React.Component {
  render () {
    return (
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
          <h1 className="display-4">404 Not Found</h1>
          <p className="lead">Post or page you are looking for is not found.</p>
        </div>
      </div>
    )
  }
}

export default PageNotFound;