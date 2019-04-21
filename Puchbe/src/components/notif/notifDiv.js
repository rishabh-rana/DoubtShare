import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 97%;
  border-radius: 5px;
  margin-bottom: 12px;
  background: rgba(200, 200, 200, 0.5);
  padding: 10px;
  box-sizing: border-box;
`;

class NotifDiv extends React.Component {
  render() {
    return (
      <Container onClick={this.props.onClick}>{this.props.message}</Container>
    );
  }
}
export default NotifDiv;
