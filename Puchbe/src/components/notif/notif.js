import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { getSingleQuestion, flushFeed } from "../../actions/feed/getFeedChron";
import Loader from "../../components/ui/loader/loader";
import { firestore } from "../../config/firebase";
import NotifDiv from "./notifDiv";
import Fullmessage from "../profile/Fullmessage";
import ErrorBoundary from "../errorHandler/ErrorBoundary";
import Button from "../ui/button";

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
    loading: false,
    lastDoc: null,
    feedDone: false
  };

  getNotifs = async () => {
    this.setState({ loading: true });
    let newFeed = false;
    let notifs = [];
    let query = firestore
      .collection("users")
      .doc(this.props.uid)
      .collection("notifications")
      .orderBy("timestamp", "desc");

    if (this.state.notifs.length !== 0) {
      query = query.startAfter(this.state.lastDoc);
    } else {
      newFeed = true;
    }

    if (!this.state.feedDone) {
      const snap = await query.limit(4).get();
      let lastDoc = snap.docs[snap.docs.length - 1];

      if (lastDoc) {
        this.setState({ lastDoc: lastDoc });
      } else {
        this.setState({ feedDone: true });
      }

      if (snap.docs.length < 4) this.setState({ feedDone: true });

      snap.forEach(doc => {
        notifs.push({
          ...doc.data(),
          docid: doc.id
        });
      });

      if (newFeed) {
        this.setState({ notifs: notifs, loading: false });
      } else {
        this.setState({
          notifs: [...this.state.notifs, ...notifs],
          loading: false
        });
      }
    }
  };

  componentDidMount() {
    this.getNotifs();
  }

  render() {
    return (
      <ErrorBoundary>
        <Container id="abcd">
          <Header>Notifications</Header>
          {this.state.notifs.length > 0 &&
            this.state.notifs.map(notif => {
              return (
                <NotifDiv
                  auth={this.props.uid}
                  id={notif.docid}
                  active={notif.read || false}
                  message={notif.description}
                  onClick={() => {
                    this.props.flushFeed();
                    this.props.getSingleQuestion(notif.questionId);
                    this.props.history.push("/single_question");
                  }}
                />
              );
            })}
          {this.state.feedDone ? null : this.state.loading ? (
            <Loader />
          ) : (
            <Button label="load more" color="dark" onClick={this.getNotifs} />
          )}
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
