import React from "react";
import styled from "styled-components";
import colorParser from "../ui/color/colorParser";
import { firestore } from "../../config/firebase";

const Container = styled.div`
  width: 100%;
  border-bottom: solid 1px #333333;
  background: #fff;
  padding: 16px;
  opacity: 0.8;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const RedDot = styled.div`
  width: 15px;
  height: 8px;
  background-color: ${props =>
    props.active ? colorParser("primary") : "#323232"};
  border-radius: 50%;
  margin-right: 10px;
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
        <RedDot active={!this.props.active} />
        {this.props.message + " Tap to go to answer."}
      </Container>
    );
  }
}
export default NotifDiv;
