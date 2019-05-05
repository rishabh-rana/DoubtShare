import React from "react";
import { connect } from "react-redux";
import * as action from "../../../actions/answer/answerQuestion";
import styled from "styled-components";
import Button from "../../ui/button";
import ImageButton from "../../filepicker/addImageButton";
import mixpanel from "../../../config/mixpanel";

import ErrorBoundary from "../../errorHandler/ErrorBoundary";

const DescriptionInput = styled.textarea`
  border: 1px solid rgba(200, 200, 200, 0.8);
  padding: 5px;
  border-radius: 5px;
  width: 97%;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 18px;
  outline: none;
`;

const Container = styled.div`
  padding: 10px;
  overflow-y: scroll;
  height: ${window.screen.height};
`;

class FinalScreen extends React.Component {
  state = {
    description: ""
  };

  answer = () => {
    this.props.loader();
    mixpanel.track("Posted Answer to Question");
    this.props.answerQuestion(
      {
        description: this.state.description,
        file: this.props.file,
        type: this.props.type,
        displayName: this.props.auth.displayName,
        uid: this.props.auth.uid
      },
      this.props.docid,
      () => {
        this.props.changeAnswerMode(false);
      }
    );
  };
  render() {
    return (
      <ErrorBoundary>
        <Container>
          <video
            src={this.props.file}
            controls
            className="filterFocus"
            width="100%"
          />
          <ImageButton
            label="Retake Video"
            color="primary"
            setImage={this.props.setImage}
            onChangeHandler={() => {
              mixpanel.track("REstartedAnsweringQuestion");
              this.props.changeAnswerMode(true, this.props.docid);
              this.props.handleRetake();
            }}
          />

          <DescriptionInput
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
            placeholder="enter description/ hints for answer"
          />
          <Button onClick={this.answer} label="Post Answer" color="dark" />
          <div style={{ height: "80px" }} />
        </Container>
      </ErrorBoundary>
    );
  }
}

const mapstate = state => {
  return {
    auth: state.auth
  };
};

export default connect(
  mapstate,
  action
)(FinalScreen);
