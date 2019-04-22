import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/auth/googleAuth";
import * as getFeed from "../../actions/feed/getFeedChron";
import Loader from "../ui/loader/loader";
import ProfileHeader from "./profileHeader";
import FeedView from "../../components/feed/feedView";
import FullMessage from "./Fullmessage";
import mixpanel from "../../config/mixpanel";
import ErrorBoundary from "../errorHandler/ErrorBoundary";
import GhostUIFeedCard from "../feed/ghostUI";

class ProfileScreen extends React.Component {
  state = {
    selected: "FOL",
    loading: false,
    showMessage: false
  };

  getContent(selected) {
    if (this.state.loading) return <GhostUIFeedCard />;
    if (this.state.showMessage) {
      return <FullMessage message="No items to show" />;
    }
    switch (selected) {
      case "FOL":
        return (
          <FeedView
            filter={"reAsks." + this.props.auth.uid}
            stopRefresh={true}
            history={this.props.history}
          />
        );
      case "ASK":
        return (
          <FeedView
            filter={"uploader." + this.props.auth.uid}
            stopRefresh={true}
            history={this.props.history}
          />
        );
      case "BKM":
        return (
          <FeedView
            filter={"bookmarks." + this.props.auth.uid}
            stopRefresh={true}
            history={this.props.history}
          />
        );
      default:
        return null;
    }
  }

  getBookmarks = async () => {
    this.setState({ loading: true });
    this.props.flushFeed();
    await this.props.getFeed("bookmarks." + this.props.auth.uid);
    if (this.props.feed.length === 0) {
      this.setState({ showMessage: true });
    }
    this.setState({ loading: false });
  };

  getAsked = async () => {
    this.setState({ loading: true });
    this.props.flushFeed();
    await this.props.getFeed("uploader." + this.props.auth.uid);
    if (this.props.feed.length === 0) {
      this.setState({ showMessage: true });
    }
    this.setState({ loading: false });
  };

  getFollowed = async () => {
    this.setState({ loading: true });
    this.props.flushFeed();
    await this.props.getFeed("reAsks." + this.props.auth.uid);
    if (this.props.feed.length === 0) {
      this.setState({ showMessage: true });
    }
    this.setState({ loading: false });
  };

  selectSection = section => {
    mixpanel.track("selected " + section + " section on Profile Screen");
    this.setState({ showMessage: false });
    if (section === "BKM") this.getBookmarks();
    if (section === "ASK") this.getAsked();
    if (section === "FOL") this.getFollowed();
    this.setState({
      selected: section
    });
  };

  componentDidMount() {
    this.selectSection("FOL");
  }

  render() {
    return (
      <ErrorBoundary>
        <div style={{ overflowY: "scroll", height: window.screen.height }}>
          <ProfileHeader
            selectSection={this.selectSection}
            selected={this.state.selected}
            auth={this.props.auth}
            signout={this.props.signout}
          />

          {this.getContent(this.state.selected)}
        </div>
      </ErrorBoundary>
    );
  }
}

const mapstate = state => {
  return {
    auth: state.auth,
    feed: state.feed.data
  };
};

export default connect(
  mapstate,
  {
    ...actions,
    ...getFeed
  }
)(ProfileScreen);
