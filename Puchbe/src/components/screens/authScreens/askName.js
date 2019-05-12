import React from "react";
import styled from "styled-components";
import Button from "../../ui/button";
import { connect } from "react-redux";
import { completeSignin } from "../../../actions/auth/phoneAuth";
import firebase from "firebase/app";

const EnterName = styled.div`
  font-size: 18px;
  text-align: center;
`;

const NameInput = styled.input`
  border: 1px solid grey;
  border-radius: 8px;
  height: 40px;
  text-align: center;
  margin-top: 30px;
`;
const Logo = styled.div`
  background: url("./logo.png");
  width: 60%;
  height: 100px;
  margin: 80px auto;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

const Container = styled.div`
  text-align: center;
  overflow-y: scroll;
  padding: 30px;
  background: #ffffff;
`;

const ErrorValidation = styled.div`
  margin-top: 10px;
  color: red;
  font-size: 16px;
  text-align: center;
`;

class AskName extends React.Component {
  state = {
    displayName: "",
    acceptedPrivatePolicy: false,
    error: false,
    errormessage: null
  };

  handleUpdate = () => {
    if (this.state.acceptedPrivatePolicy === false) {
      this.setState({
        error: true,
        errormessage: "Please accept the Privacy Policy to continue"
      });
      return;
    }
    if (this.state.displayName.length < 4) {
      this.setState({
        error: true,
        errormessage: "Please enter a username of 5 characters or more"
      });
      return;
    }
    let auth = firebase.auth().currentUser;

    let result = {
      additionalUserInfo: {
        isNewUser: true
      },
      user: {
        uid: auth.uid,
        displayName: this.state.displayName,
        phoneNumber: auth.phoneNumber,
        metadata: {
          creationTime: Date.now()
        }
      },
      name: this.state.displayName
    };

    this.props.completeSignin(result);
  };
  render() {
    return (
      <Container>
        <Logo />
        <EnterName>What would you like us to call you?</EnterName>
        <NameInput
          value={this.state.displayName}
          onChange={e => this.setState({ displayName: e.target.value })}
          placeholder="Enter name"
        />
        <div style={{ textAlign: "left", marginTop: "30px" }}>
          <a target="_blank" href="./privacy_policy.html">
            Privacy Policy
          </a>
        </div>
        <div style={{ textAlign: "left" }}>
          <input
            style={{ display: "inline-block", textAlign: "left" }}
            type="checkbox"
            value={this.state.acceptedPrivatePolicy}
            onChange={() =>
              this.setState({
                acceptedPrivatePolicy: !this.state.acceptedPrivatePolicy
              })
            }
          />
          <span sty>I Accept the Privacy Policy</span>
        </div>

        {this.state.error && (
          <ErrorValidation>
            {this.state.errormessage
              ? this.state.errormessage
              : "Something went wrong. Please try again"}
          </ErrorValidation>
        )}

        <Button onClick={this.handleUpdate} label="Submit" marginTop="30px" />
      </Container>
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
  { completeSignin }
)(AskName);
