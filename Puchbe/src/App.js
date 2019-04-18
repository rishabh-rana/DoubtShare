import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { firestore } from "./config/firebase";
import mixpanel from "./config/mixpanel";

import { connect } from "react-redux";

import * as update from "./actions/updateApp/update";

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
    this.props.checkUpdates();
  };

  render() {
    if (this.props.auth === null) {
      return <SignIn />;
    }
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
  update
)(App);
