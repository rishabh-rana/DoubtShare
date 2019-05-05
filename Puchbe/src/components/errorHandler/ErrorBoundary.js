import React from "react";
import ErrorBoundaryTemplate from "./ErrorBoundaryTemplate";
import mixpanel from "../../config/mixpanel";

class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  };
  //catch error from children
  componentDidCatch(error, info) {
    mixpanel.track("CrashedApplication");
    this.setState({
      hasError: true
    });
  }
  render() {
    if (this.state.hasError) {
      //return a template for the error page if error [make a graphic for this]

      return <ErrorBoundaryTemplate message={this.props.message} />;
    } else {
      // return children if no error
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
