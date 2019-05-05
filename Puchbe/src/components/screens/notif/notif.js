import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  getSingleQuestion,
  flushFeed
} from "../../../actions/feed/getFeedChron";
import { getNotifications } from "../../../actions/notifications/notif";
import Loader from "../../ui/loader/loader";
import SingleNotification from "./singleNotification";
import Fullmessage from "../../ui/fullScreenMessage";
import ErrorBoundary from "../../errorHandler/ErrorBoundary";
import Button from "../../ui/button";

import mixpanel from "../../../config/mixpanel";

const Container = styled.div`
  padding: 10px;
`;
const Header = styled.div`
  font-size: 22px;
  text-align: center;
  margin-top: 20px;
  color: grey;
  opacity: 0.8;
  margin-bottom: 20px;
`;

class NotificationScreen extends React.Component {
  state = {
    notifs: [],
    lastDoc: null,
    feedDone: false
  };

  getNotifs = async () => {
    this.props.getNotifications(this.props.uid, this.props.paginate);
  };

  componentDidMount() {
    if (this.props.data === null) {
      this.getNotifs();
    }
  }

  render() {
    return (
      <ErrorBoundary>
        <Container id="abcd">
          <Header>Notifications</Header>
          {this.props.data &&
            this.props.data.map((notif, index) => {
              return (
                <SingleNotification
                  key={index}
                  auth={this.props.uid}
                  id={notif.docid}
                  active={notif.read || false}
                  message={notif.description}
                  onClick={() => {
                    mixpanel.track("pressed Notification in notif tab");
                    this.props.flushFeed();
                    this.props.getSingleQuestion(notif.questionId);
                    this.props.history.push("/single_question");
                  }}
                />
              );
            })}
          {this.props.paginate.feedDone ? null : this.props.data === null ? (
            <Loader />
          ) : (
            <Button label="load more" color="dark" onClick={this.getNotifs} />
          )}
          {this.props.data !== null && this.props.data.length === 0 && (
            <Fullmessage message="No notifications" />
          )}
          <div style={{ height: "80px" }} />
        </Container>
      </ErrorBoundary>
    );
  }
}

const mapstate = state => {
  return {
    uid: state.auth.uid,
    paginate: state.notifications.paginate,
    data: state.notifications.data
  };
};

export default connect(
  mapstate,
  { getSingleQuestion, flushFeed, getNotifications }
)(NotificationScreen);
