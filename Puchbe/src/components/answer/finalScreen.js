import React from "react";
import { connect } from "react-redux";
import * as action from "../../actions/answer/answerQuestion";
import styled from "styled-components";
import Button from "../ui/button";

const DescriptionInput = styled.input`
  border: 1px solid grey;
  padding: 5px;
  padding-left: 10px;
  border-radius: 5px;
`;

class FinalScreen extends React.Component {
  state = {
    description: ""
  };

  answer = () => {
    this.props.loader();
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
      <div>
        <video
          src={this.props.file}
          controls
          className="filterFocus"
          width="100%"
        />

        <DescriptionInput
          value={this.state.description}
          onChange={e => this.setState({ description: e.target.value })}
          placeholder="description"
        />
        <Button onClick={this.answer} label="Answer" />
      </div>
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
