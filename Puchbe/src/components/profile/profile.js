import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/auth/googleAuth";
import * as getFeed from "../../actions/feed/getFeedChron";
import Loader from "../ui/loader/loader";
import ProfileHeader from "./profileHeader";
import FeedView from "../../components/feed/feedView";
import FullMessage from "./Fullmessage";

class ProfileScreen extends React.Component {
  state = {
    selected: "FOL",
    loading: false,
    showMessage: false
  };

  getContent(selected) {
    if (this.state.loading) return <Loader />;
    if (this.state.showMessage) {
      return <FullMessage message="No items to show" />;
    }
    switch (selected) {
      case "FOL":
        return <FullMessage message="Coming Soon" />;
      case "ASK":
        return <FeedView filter={"uploader." + this.props.auth.uid} />;
      case "BKM":
        return <FeedView filter={"bookmarks." + this.props.auth.uid} />;
      default:
        return null;
    }
  }

  getBookmarks = async () => {
    this.setState({ loading: true });
    await this.props.getFeed("bookmarks." + this.props.auth.uid);
    if (this.props.feed.length === 0) {
      this.setState({ showMessage: true });
    }
    this.setState({ loading: false });
  };

  getAsked = async () => {
    this.setState({ loading: true });
    await this.props.getFeed("uploader." + this.props.auth.uid);
    if (this.props.feed.length === 0) {
      this.setState({ showMessage: true });
    }
    this.setState({ loading: false });
  };

  selectSection = section => {
    this.setState({ showMessage: false });
    if (section === "BKM") this.getBookmarks();
    if (section === "ASK") this.getAsked();
    this.setState({
      selected: section
    });
  };

  render() {
    return (
      <React.Fragment>
        <ProfileHeader
          selectSection={this.selectSection}
          selected={this.state.selected}
          auth={this.props.auth}
          signout={this.props.signout}
        />

        {this.getContent(this.state.selected)}
      </React.Fragment>
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
