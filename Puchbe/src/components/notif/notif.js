import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { getSingleQuestion, flushFeed } from "../../actions/feed/getFeedChron";
import Loader from "../../components/ui/loader/loader";
import { firestore } from "../../config/firebase";
import NotifDiv from "./notifDiv";
import Fullmessage from "../profile/Fullmessage";
import ErrorBoundary from "../errorHandler/ErrorBoundary";

const Container = styled.div`
  padding: 10px;
`;

class NotificationScreen extends React.Component {
  state = {
    notifs: [],
    loading: false
  };

  getNotifs = async () => {
    this.setState({ loading: true });
    const notifs = await firestore
      .collection("users")
      .doc(this.props.uid)
      .collection("notifications")
      .orderBy("timestamp", "desc")
      .limit(15)
      .get();

    const notifications = [];

    notifs.forEach(doc => {
      notifications.push(doc.data());
    });

    this.setState({
      notifs: notifications,
      loading: false
    });
  };

  componentDidMount() {
    this.getNotifs();
  }

  render() {
    return (
      <ErrorBoundary>
        <Container id="abcd">
          {this.state.loading && <Loader />}
          {!this.state.loading &&
            this.state.notifs.map(notif => {
              return (
                <NotifDiv
                  message={notif.description}
                  onClick={() => {
                    this.props.flushFeed();
                    this.props.getSingleQuestion(notif.questionId);
                    this.props.history.push("/single_question");
                  }}
                />
              );
            })}
          {!this.state.loading && this.state.notifs.length === 0 && (
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
    uid: state.auth.uid
  };
};

export default connect(
  mapstate,
  { getSingleQuestion, flushFeed }
)(NotificationScreen);
