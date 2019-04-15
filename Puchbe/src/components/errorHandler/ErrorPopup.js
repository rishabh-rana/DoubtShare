import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/error/errorHandler";
import styled from "styled-components";

const Err = styled.div`
  position: absolute;
  top: 10px;
  transition: 0.5s;
  left: 10px;
  border-radius: 5px;
  right: 10px;
  min-height: 30px;
  font-size: 20px;
  padding: 7px;
  background: ${props => (props.critical ? "#FA8072" : "#FFE4B5")};
`;

//a function to get the bootstrap class name from the color input in the dispatch

//a functional component which handles when our stateful component will mount
const ErrorPopup = props => {
  return props.error ? (
    <Popup
      message={props.error.message}
      duration={props.error.duration}
      critical={props.error.color === "red" ? true : false}
      code={props.code}
      moreinfo={props.moreinfo}
      resolveError={props.resolveError}
    />
  ) : (
    <React.Fragment />
  );
};

//Main Popup
class Popup extends React.Component {
  //Remove the popup after 'duration' miliseconds automatically
  componentDidMount() {
    setTimeout(() => {
      //calls dispatch(throwerror) witha null payload, setting error to null and removing the popup
      this.props.resolveError();
    }, this.props.duration);
  }

  render() {
    let { message, code, critical, moreinfo } = this.props;

    //Return the popup to be shown when the state has an error != null
    return (
      <Err critical={critical} id="popup_error">
        <strong>{code}</strong> {message}
      </Err>
    );
  }
}

//redux setup
const mapstate = state => {
  return {
    error: state.error.error
  };
};
//default export
export default connect(
  mapstate,
  actions
)(ErrorPopup);
