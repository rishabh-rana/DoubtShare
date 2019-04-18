import React from "react";
import styled from "styled-components";

const Holder = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: black;
  opacity: 0.8;
  z-index: 1000;
`;

const HolderText = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: white;
  font-size: 25px;
  padding: 20px;
  text-align: center;
  z-index: 10000;
  display: flex;
`;

class Overlay extends React.Component {
  state = {
    open: true
  };

  render() {
    return this.state.open ? (
      <React.Fragment>
        <Holder onClick={() => this.setState({ open: false })} />
        <HolderText onClick={() => this.setState({ open: false })}>
          {this.props.text}
        </HolderText>
      </React.Fragment>
    ) : null;
  }
}
export default Overlay;
