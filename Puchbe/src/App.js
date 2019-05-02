import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { firestore, messaging } from "./config/firebase";
import mixpanel from "./config/mixpanel";

import { connect } from "react-redux";

import * as update from "./actions/updateApp/update";
import * as notifs from "./actions/notifications/notif";

import Feed from "./components/feed/feed";
import BottomNavigator from "./components/ui/bottomNavigator";
import Header from "./components/ui/header";
import SearchScreen from "./components/search/search";
import AskScreen from "./components/ask/ask";
import NotificationScreen from "./components/notif/notif";
import ProfileScreen from "./components/profile/profile";
import ErrorPopup from "./components/errorHandler/ErrorPopup";
import SignIn from "./components/authScreens/signIn";
import GoToFeed from "./components/ui/redirectToFeed";
import PaddingBox from "./components/ui/paddingBox";

import ErrorBoundary from "./components/errorHandler/ErrorBoundary";

import "./App.css";
import SingleQuesFeed from "./components/feed/singleQuesFeed";

class App extends Component {
  componentDidMount = async () => {
    console.log(this.props.auth);
    if (this.props.auth) {
      mixpanel.identify(this.props.auth);
    }

    // check for app updates
    this.props.checkUpdates();

    // setup push notifications
    this.setupPushNotifications();
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
            <Route path="/" component={BottomNavigator} />
            <Route path="/" component={ErrorPopup} />
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
  { ...update, ...notifs }
)(App);
