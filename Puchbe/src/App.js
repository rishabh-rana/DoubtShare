import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { firestore } from "./config/firebase";

import { connect } from "react-redux";

import * as update from "./actions/updateApp/update";

import Feed from "./components/feed/feed";
import BottomNavigator from "./components/ui/bottomNavigator";
import SearchScreen from "./components/search/search";
import AskScreen from "./components/ask/ask";
import NotificationScreen from "./components/notif/notif";
import ProfileScreen from "./components/profile/profile";
import ErrorPopup from "./components/errorHandler/ErrorPopup";
import SignIn from "./components/authScreens/signIn";
import GoToFeed from "./components/ui/redirectToFeed";

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
      <BrowserRouter>
        <div
          style={{ height: "100%", paddingBottom: "60px" }}
          id="getFullHeight"
        >
          <Route path="/" exact component={GoToFeed} />
          <Route path="/feed" exact component={Feed} />
          <Route path="/search" exact component={SearchScreen} />
          <Route path="/ask" exact component={AskScreen} />
          <Route path="/notifications" exact component={NotificationScreen} />
          <Route path="/profile" exact component={ProfileScreen} />
          <Route path="/" component={BottomNavigator} />
          <ErrorPopup />
        </div>
      </BrowserRouter>
    );
  }
}

const mapstate = state => {
  return {
    auth: state.auth.uid
  };
};

export default connect(
  mapstate,
  update
)(App);
