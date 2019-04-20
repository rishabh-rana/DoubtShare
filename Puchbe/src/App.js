import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { firestore, messaging } from "./config/firebase";

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

class App extends Component {
  componentDidMount = async () => {
    // check for app updates
    this.props.checkUpdates();

    // setup push notifications
    this.setupPushNotifications();
  };

  requestPermissionForPush = () => {
    // check if permission is granted
    const permission = localStorage.getItem("pushPermission");
    if (permission) return;

    const uid = this.props.auth;

    messaging
      .requestPermission()
      .then(function() {
        messaging
          .getToken()
          .then(function(currentToken) {
            if (currentToken) {
              localStorage.setItem("pushPermission", currentToken);
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

    // handle foreground notifs
    messaging.onMessage(function(payload) {
      this.props.handleForegroundNotif(payload);
      // ...
    });
  };

  render() {
    //if (this.props.auth === null) {
    //  return <SignIn />;
    //}
    return (
      <ErrorBoundary>
        <BrowserRouter>
          <div style={{ height: window.screen.height }}>
            <Route path="/" component={Header} />
            <Route path="/" exact component={GoToFeed} />
            <Route path="/feed" exact component={Feed} />
            <Route path="/search" exact component={SearchScreen} />
            <Route path="/ask" exact component={AskScreen} />
            <Route path="/notifications" exact component={NotificationScreen} />
            <Route path="/profile" exact component={ProfileScreen} />
            <Route path="/" component={PaddingBox} />
            <Route path="/" component={BottomNavigator} />
            <ErrorPopup />
          </div>
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
