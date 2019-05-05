import React from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/auth/googleAuth";
import * as getFeed from "../../../actions/feed/getFeedChron";
import { followUser, unfollowUser } from "../../../actions/profile/follow";
import { getUserData } from "../../../actions/profile/getProfile";
import ProfileHeader from "./profileHeader";
import { withRouter } from "react-router-dom";
import FeedView from "../feed/feedView";
import FullMessage from "../../ui/fullScreenMessage";
import mixpanel from "../../../config/mixpanel";
import ErrorBoundary from "../../errorHandler/ErrorBoundary";
import GhostUIFeedCard from "../feed/ghostUI";

class ProfileScreen extends React.Component {
  state = {
    selected: this.props.otherPersonProfile ? "ANS" : "FOL",
    loading: false,
    showMessage: false,
    display: "main"
  };

  newuid = null;

  getContent() {
    if (this.state.loading) return <GhostUIFeedCard />;
    if (this.state.showMessage) {
      return <FullMessage message="No items to show" />;
    }
    switch (this.state.selected) {
      case "FOL":
        if (this.props.otherPersonProfile) return null;
        return (
          <FeedView
            filter={"reAsks." + this.newuid}
            stopRefresh={true}
            history={this.props.history}
          />
        );
      case "ASK":
        return (
          <FeedView
            filter={"uploader." + this.newuid}
            stopRefresh={true}
            history={this.props.history}
          />
        );
      case "BKM":
        if (this.props.otherPersonProfile) return null;
        return (
          <FeedView
            filter={"bookmarks." + this.newuid}
            stopRefresh={true}
            history={this.props.history}
          />
        );
      case "ANS":
        return (
          <FeedView
            filter={"answerer." + this.newuid}
            stopRefresh={true}
            history={this.props.history}
          />
        );
    }
  }

  getAsked = async () => {
    this.setState({ loading: true });
    this.props.flushFeed();
    await this.props.getFeed("uploader." + this.newuid);
    if (this.props.feed.length === 0) {
      this.setState({ showMessage: true });
    }
    this.setState({ loading: false });
  };

  getAnswered = async () => {
    this.setState({ loading: true });
    this.props.flushFeed();
    await this.props.getFeed("answerer." + this.newuid);
    if (this.props.feed.length === 0) {
      this.setState({ showMessage: true });
    }
    this.setState({ loading: false });
  };

  selectSection = section => {
    mixpanel.track("selected " + section + " section on Profile Screen");
    this.setState({ showMessage: false });
    if (section === "ASK") this.getAsked();
    if (section === "ANS") this.getAnswered();
    if (section === "BKM") this.getBookmarks();
    if (section === "FOL") this.getFollowed();
    this.setState({
      selected: section
    });
  };
  getBookmarks = async () => {
    this.setState({ loading: true });
    this.props.flushFeed();
    await this.props.getFeed("bookmarks." + this.props.auth.uid);
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

  handleFollow = () => {
    if (this.props.auth.uid === this.newuid) return;

    this.setState({
      isFollower: !this.state.isFollower
    });

    if (!this.state.isFollower) {
      this.props.followUser(
        this.props.auth.uid,
        this.newuid,
        this.props.auth.displayName,
        this.props.otherUserData.name
      );
      if (this.props.otherUserData.followers) {
        this.props.otherUserData.followers[
          this.props.auth.uid
        ] = this.props.auth.displayName;
      } else {
        this.props.otherUserData.followers = {
          [this.props.auth.uid]: this.props.auth.displayName
        };
      }
    } else {
      this.props.unfollowUser(this.props.auth.uid, this.newuid);
      delete this.props.otherUserData.followers[this.props.auth.uid];
    }
  };

  componentDidMount() {
    this.newuid = this.props.otherPersonProfile
      ? this.props.location.pathname.split("/")[2]
      : this.props.auth.uid;
    this.props.otherPersonProfile
      ? this.selectSection("ANS")
      : this.selectSection("FOL");

    if (this.props.otherPersonProfile) {
      this.props.getUserData(this.newuid, false);
    } else {
      if (this.props.userData === null)
        this.props.getUserData(this.newuid, true);
    }
  }

  render() {
    if (this.props.otherUserData !== null) {
      let isFollower = false;
      if (this.props.otherUserData.followers) {
        if (
          Object.keys(this.props.otherUserData.followers).indexOf(
            this.props.auth.uid
          ) !== -1
        )
          isFollower = true;
      }
      if (this.state.isFollower !== isFollower) {
        this.setState({ isFollower: isFollower });
      }
    }

    return (
      <ErrorBoundary>
        <div style={{ overflowY: "scroll", height: window.screen.height }}>
          <ProfileHeader
            changeDisplay={type => this.setState({ display: type })}
            isFollower={this.state.isFollower}
            followUser={this.props.followUser}
            otherPersonProfile={this.props.otherPersonProfile || false}
            selectSection={this.selectSection}
            selected={this.state.selected}
            auth={this.props.auth}
            handleFollow={this.handleFollow}
            signout={this.props.signout}
            data={
              this.props.otherPersonProfile
                ? this.props.otherUserData
                : this.props.userData
            }
          />

          {this.getContent()}
        </div>
      </ErrorBoundary>
    );
  }
}

const mapstate = state => {
  return {
    auth: state.auth,
    feed: state.feed.data,
    userData: state.profile.data,
    otherUserData: state.profile.newProfile
  };
};

export default withRouter(
  connect(
    mapstate,
    {
      ...actions,
      ...getFeed,
      followUser,
      unfollowUser,
      getUserData
    }
  )(ProfileScreen)
);
