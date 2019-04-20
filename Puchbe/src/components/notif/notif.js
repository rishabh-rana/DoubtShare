import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import Loader from "../../components/ui/loader/loader";
import { firestore } from "../../config/firebase";
import NotifDiv from "./notifDiv";
import Fullmessage from "../profile/Fullmessage";

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
      <Container>
        {this.state.loading && <Loader />}
        {!this.state.loading &&
          this.state.notifs.map(notif => {
            return <NotifDiv message={notif.description} />;
          })}
        {!this.state.loading && this.state.notifs.length === 0 && (
          <Fullmessage message="No notifications" />
        )}
      </Container>
    );
  }
}

const mapstate = state => {
  return {
    uid: state.auth.uid
  };
};

export default connect(mapstate)(NotificationScreen);
