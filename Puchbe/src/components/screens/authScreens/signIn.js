import React from "react";
import { connect } from "react-redux";
import * as googleAuth from "../../../actions/auth/googleAuth";
import styled from "styled-components";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input/basic-input";
import Loader from "../../ui/loader/loader";

const Logo = styled.div`
  background: url("./logo.png");
  width: 60%;
  height: 100px;
  margin: 80px auto;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

const Google = styled.img`
  width: 80%;
  max-width: 240px;
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
  background: #ffffff;
`;

const EnterNumber = styled.div`
  text-align: center;
  font-size: 16px;
  margin-bottom: 32px;
  margin-top: 32px;
  color: #232323;
`;

class SignIn extends React.Component {
  state = {
    number: null,
    error: false,
    loading: false
  };

  handleSignin = () => {
    if (this.state.number) {
      console.log(this.state.number);
      this.setState({ loading: true });
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
          style={{
            height: "40px",
            width: "80%",
            maxWidth: "320px",
            backgroundColor: "#fdfdfd",
            padding: "0",
            textAlign: "center",
            outline: "none",
            border: "1px solid grey",
            borderRadius: "8px"
          }}
          placeholder="Enter phone number"
          value={this.state.number}
          onChange={otp => this.setState({ number: otp, error: false })}
          maxLength="11"
          country="IN"
        />
        {this.state.error && (
          <ErrorValidation>Please enter valid mobile number</ErrorValidation>
        )}
        <EnterNumber>Step 2) Click the button below</EnterNumber>
        {this.state.loading && <Loader />}
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
