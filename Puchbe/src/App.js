import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { firestore, messaging } from "./config/firebase";
import mixpanel from "./config/mixpanel";

import { connect } from "react-redux";

import * as update from "./actions/updateApp/update";
import * as notifs from "./actions/notifications/notif";
import { getUserData } from "./actions/profile/getProfile";

import Feed from "./components/screens/feed/feed";
import BottomNavigator from "./components/ui/bottomNavigator";
import Header from "./components/ui/header";
import SearchScreen from "./components/screens/search/search";
import AskScreen from "./components/screens/ask/ask";
import NotificationScreen from "./components/screens/notif/notif";
import ProfileScreen from "./components/screens/profile/profile";
import ErrorPopup from "./components/errorHandler/ErrorPopup";
import SignIn from "./components/screens/authScreens/signIn";
import GoToFeed from "./components/ui/redirectToFeed";
import PaddingBox from "./components/ui/paddingBox";
import SingleQuesFeed from "./components/screens/feed/singleQuesFeed";
import ErrorBoundary from "./components/errorHandler/ErrorBoundary";
import { getNotifications } from "./actions/notifications/notif";

import "./App.css";
import AskName from "./components/screens/authScreens/askName";
import EditPicture from "./components/screens/admin/editPicture";

class App extends Component {
  componentDidMount = async () => {
    console.log(this.props.auth);
    if (this.props.auth) {
      mixpanel.identify(this.props.auth);
      // setup push notifications
      this.setupPushNotifications();
      console.log("Sending Request for data");
      this.props.getUserData(this.props.auth, true);
      this.props.getNotifications(this.props.auth);
    }

    // check for app updates
    this.props.checkUpdates();
  };

  requestPermissionForPush = async () => {
    // check if permission is granted
    if (this.props.auth) {
      const doc = await firestore
        .collection("users")
        .doc(this.props.auth)
        .get();

      const uid = this.props.auth;

      messaging
        .requestPermission()
        .then(function() {
          messaging
            .getToken()
            .then(function(currentToken) {
              if (currentToken && currentToken !== doc.data().gcm_token) {
                firestore
                  .collection("users")
                  .doc(uid)
                  .update({
                    gcm_token: currentToken
                  });
              } else {
                // do something
              }
            })
            .catch(function(err) {
              console.log("An error occurred while retrieving token. ", err);
            });
        })
        .catch(function(err) {
          console.log("Unable to get permission to notify.", err);
        });
    }
  };

  setupPushNotifications = () => {
    // request permissions
    this.requestPermissionForPush();

    // check for token refreshes
    messaging.onTokenRefresh(function() {
      messaging
        .getToken()
        .then(function(refreshedToken) {
          localStorage.setItem("pushPermission", refreshedToken);
          firestore
            .collection("users")
            .doc(this.props.auth)
            .update({
              gcm_token: refreshedToken
            });
          // ...
        })
        .catch(function(err) {
          console.log("Unable to retrieve refreshed token ", err);
        });
    });

    const handleForegroundNotif = this.props.handleForegroundNotif;

    // handle foreground notifs
    messaging.onMessage(function(payload) {
      handleForegroundNotif(payload);
      // ...
    });
  };

  render() {
    if (this.props.auth === null) {
      return <SignIn />;
    }
    if (this.props.authentication.displayName === "Username_Undefined") {
      return <AskName />;
    }
    return (
      <ErrorBoundary>
        <BrowserRouter>
          <React.Fragment>
            <Route path="/" component={Header} />
            <Route path="/" exact component={GoToFeed} />

            <Route path="/feed" exact component={Feed} />
            <Route path="/search" exact component={SearchScreen} />
            <Route path="/ask" exact component={AskScreen} />
            <Route path="/notifications" exact component={NotificationScreen} />
            <Route path="/profile" exact component={ProfileScreen} />
            <Route path="/" component={PaddingBox} />
            <Route path="/single_question" component={SingleQuesFeed} />
            <Route
              path="/view_profile"
              component={() => <ProfileScreen otherPersonProfile />}
            />
            <Route path="/" component={BottomNavigator} />
            <Route path="/" component={ErrorPopup} />
            <Route path="/editPictureAdmin" component={EditPicture} />
          </React.Fragment>
        </BrowserRouter>
      </ErrorBoundary>
    );
  }
}

const mapstate = state => {
  return {
    auth: state.auth.uid,
    authentication: state.auth
  };
};

export default connect(
  mapstate,
  { ...update, ...notifs, getUserData, getNotifications }
)(App);
