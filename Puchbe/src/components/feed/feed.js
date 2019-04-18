import React from "react";
import { connect } from "react-redux";
import Loader from "../ui/loader/loader";
import Help from "../ui/overlayHelp";

import * as actions from "../../actions/feed/getFeedChron";
import FeedView from "./feedView";

class Feed extends React.Component {
  componentDidMount() {
    this.props.getFeed();
  }

  render() {
    if (this.props.feed.length === 0) {
      return (
        <div style={{ marginTop: "50%" }}>
          <Loader />
        </div>
      );
    }

    return (
      <React.Fragment>
        <Help text="Swipe left" />
        <FeedView history={this.props.history} />
      </React.Fragment>
    );
  }
}

const mapstate = state => {
  return {
    feed: state.feed.data
  };
};

export default connect(
  mapstate,
  actions
)(Feed);
