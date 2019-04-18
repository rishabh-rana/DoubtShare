import React from "react";
import { connect } from "react-redux";
import Loader from "../ui/loader/loader";
// import Help from "../ui/overlayHelp";

import mixpanel from "../../config/mixpanel";
import { firestore } from "../../config/firebase";

import * as actions from "../../actions/feed/getFeedChron";
import * as authee from "../../actions/auth/googleAuth";
import FeedView from "./feedView";

class Feed extends React.Component {
  componentDidMount() {
    if (this.props.authentication && this.props.authentication.phoneNumber) {
      console.log("kjhgfdfghj");
      firestore
        .collection("users")
        .doc(this.props.authentication.uid)
        .update({
          phone: this.props.authentication.phoneNumber
        });
      mixpanel.identify(this.props.authentication.uid);
      mixpanel.people.set({
        $phone: this.props.authentication.phoneNumber
      });
      this.props.setPhoneNumber(null);
    }
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
        <FeedView history={this.props.history} />
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
