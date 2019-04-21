import React from "react";
import styled from "styled-components";
import colorParser from "../ui/color/colorParser";
import { firestore } from "../../config/firebase";

const Container = styled.div`
  width: 100%;
  border-radius: 5px;
  margin-bottom: 12px;
  background: ${props =>
    props.active ? colorParser("primary") : "rgba(200, 200, 200, 0.5)"};
  padding: 10px;
  opacity: 0.8;
  box-sizing: border-box;
`;

class NotifDiv extends React.Component {
  handleClick = () => {
    firestore
      .collection("users")
      .doc(this.props.auth)
      .collection("notifications")
      .doc(this.props.id)
      .update({
        read: true
      });
    this.props.onClick();
  };

  render() {
    return (
      <Container active={!this.props.active} onClick={this.handleClick}>
        {this.props.message + " Tap to go to answer."}
      </Container>
    );
  }
}
export default NotifDiv;
