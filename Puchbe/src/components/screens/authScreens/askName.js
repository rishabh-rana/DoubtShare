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

class AskName extends React.Component {
  state = {
    displayName: ""
  };

  handleUpdate = () => {
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
