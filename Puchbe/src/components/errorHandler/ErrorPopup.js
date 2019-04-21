import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/error/errorHandler";
import {
  getFeed,
  flushFeed,
  getSingleQuestion
} from "../../actions/feed/getFeedChron";
import styled, { keyframes } from "styled-components";
import mixpanel from "../../config/mixpanel";

const comeInFromTop = keyframes`
  0% {
    top : -100px;
  }

  10% {
    top : 0;
  }

  90% {
    top : 0;
  }

  100% {
    top : -100px;
  }
`;

const Err = styled.div`
  position: absolute;
  top: 0;
  transition: 0.5s;
  left: 0;
  right: 0;
  animation: ${comeInFromTop} ${props => parseInt(props.duration) + 100 + "ms"};
  min-height: 60px;
  font-size: 18px;
  padding: 10px;
  padding-top: 25px;
  padding-left: 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background: white;
  border-bottom: 4px solid ${props => props.color};
`;

//a function to get the bootstrap class name from the color input in the dispatch

//a functional component which handles when our stateful component will mount
const ErrorPopup = props => {
  return props.error ? (
    <Popup
      message={props.error.message}
      duration={props.error.duration}
      color={props.error.color}
      code={props.code}
      moreinfo={props.moreinfo}
      resolveError={props.resolveError}
      onclick={props.error.onClick}
      flushFeed={props.flushFeed}
      getFeed={props.getFeed}
      getSingleQuestion={props.getSingleQuestion}
      history={props.history}
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
    let { message, code, color, duration, resolveError, onclick } = this.props;

    let handleClick = () => {};

    if (onclick === "reloadFeed") {
      handleClick = () => {
        mixpanel.track("reloadedFeedUsingNotification");
        this.props.flushFeed();
        this.props.getFeed();
      };
    } else if (onclick && onclick.action === "goToAnswer") {
      handleClick = () => {
        mixpanel.track("wentToAnswerusingNotification");
        this.props.flushFeed();
        this.props.getSingleQuestion(onclick.id);
        this.props.history.push("/single_question");
      };
    }

    //Return the popup to be shown when the state has an error != null
    return (
      <Err
        color={color}
        duration={duration}
        onClick={() => {
          handleClick();
          resolveError();
        }}
        id="popup_error"
      >
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
  { ...actions, getFeed, flushFeed, getSingleQuestion }
)(ErrorPopup);
