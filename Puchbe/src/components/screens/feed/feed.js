import React from "react";
import { connect } from "react-redux";
import Help from "../../ui/overlayHelp";
import mixpanel from "../../../config/mixpanel";
import { firestore } from "../../../config/firebase";
import * as actions from "../../../actions/feed/getFeedChron";
import * as authee from "../../../actions/auth/googleAuth";
import FeedView from "./feedView";
import GhostUIFeedCard from "./ghostUI";

class Feed extends React.Component {
  state = {
    showHelp: false
  };

  componentDidMount() {
    const firstTime = localStorage.getItem("help1");
    if (firstTime !== "shown") {
      localStorage.setItem("help1", "shown");
      this.setState({
        showHelp: true
      });
    }

    this.props.flushFeed();
    this.props.getFeed();
  }

  render() {
    if (this.props.feed.length === 0) {
      return <GhostUIFeedCard />;
    }

    return (
      <React.Fragment>
        {this.state.showHelp && (
          <Help message={<div>Swipe Left/ Right for more Questions</div>} />
        )}

        <FeedView
          history={this.props.history}
          getFeed={this.props.getFeed}
          flushFeed={this.props.flushFeed}
        />
      </React.Fragment>
    );
  }
}

const mapstate = state => {
  return {
    feed: state.feed.data,
    authentication: state.auth
  };
};

export default connect(
  mapstate,
  { ...actions, ...authee }
)(Feed);
