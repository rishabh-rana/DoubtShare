import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
  background: rgba(200, 200, 200, 0.5);
  padding: 5px;
`;

class NotifDiv extends React.Component {
  render() {
    return <Container>{this.props.message}</Container>;
  }
}
export default NotifDiv;
