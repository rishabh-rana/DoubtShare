import React from "react";
import { connect } from "react-redux";
import * as googleAuth from "../../actions/auth/googleAuth";
import styled from "styled-components";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


const Logo = styled.div`
  background: url("./logo.png");
  width: 60%;
  height: 100px;
  margin: 0 auto;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

const Google = styled.img`
  width: 80%;
  margin-top: 100px;
`;

const ErrorValidation = styled.div`
  margin-top: 10px;
  color: red;
  font-size: 16px;
  text-align: center;
`;

// const Branding = styled.div`
//   font-size: 24px;
//   color: ${colorParser("dark")};
//   text-align: center;
//   margin-top: 20px;
//   margin-bottom: 30px;
// `;

const Container = styled.div`
  text-align: center;
  overflow-y: scroll;
  padding: 30px;
  height: ${window.screen.height + "px"};
  background: #f4dc59;
`;

const EnterNumber = styled.div`
  text-align: center;
  font-size: 18px;
  margin-bottom: 16px;
  margin-top: 100px;
  opacity: 0.8;
`;

class SignIn extends React.Component {
  state = {
    number: null,
    error: false
  };

  handleSignin = () => {
    if (/^\d{10}$/.test(this.state.number)) {
      console.log(this.state.number);
      this.props.setPhoneNumber(this.state.number);
      this.props.signin();
    } else {
      this.setState({ error: true, number: null });
    }
  };

  render() {
    return (
      <Container>
        <Logo />
        <EnterNumber>Step 1) Enter Mobile Number</EnterNumber>
        <PhoneInput
          placeholder="Enter phone number"
          value={ this.state.phone }
          onChange={ otp => this.setState({ number: otp, error: false })}
          country="IN" />
        {this.state.error && (
          <ErrorValidation>Please enter valid mobile number</ErrorValidation>
        )}
        <EnterNumber>Step 2) Click Below button</EnterNumber>
        <Google onClick={this.handleSignin} src="./googleSigninButton.png" />
        <div style={{ height: "80px" }} />
      </Container>
    );
  }
}

export default connect(
  null,
  {
    ...googleAuth
  }
)(SignIn);
