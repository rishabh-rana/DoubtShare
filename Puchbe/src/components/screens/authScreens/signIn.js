import React from "react";
import { connect } from "react-redux";
import * as googleAuth from "../../../actions/auth/googleAuth";
import {
  startsigninPhone,
  completeSignin
} from "../../../actions/auth/phoneAuth";
import styled from "styled-components";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input/basic-input";
import Loader from "../../ui/loader/loader";
import firebase from "firebase/app";
import Button from "../../ui/button";

const Logo = styled.div`
  background: url("./logo.png");
  width: 60%;
  height: 100px;
  margin: 80px auto;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

const ErrorValidation = styled.div`
  margin-top: 10px;
  color: red;
  font-size: 16px;
  text-align: center;
`;

const Container = styled.div`
  text-align: center;
  overflow-y: scroll;
  padding: 30px;
  background: #ffffff;
`;

const EnterNumber = styled.div`
  text-align: center;
  font-size: 12px;
  margin-bottom: 15px;
  margin-top: 15px;
  color: #232323;
  opacity: 0.8;
`;

const Underline = styled.span`
  text-decoration: underline;
  opacity: 0.8;
  margin-left: 5px;
`;

const Holder = styled.div`
  position: relative;
  margin-top: 50px;
`;

const Captcha = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

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

class SignIn extends React.Component {
  state = {
    number: null,
    error: false,
    loading: false,
    display: "main",
    displayName: "",
    acceptedPrivatePolicy: false
  };

  handleValidation = () => {
    if (this.state.display === "main") {
      console.log(this.state.number.length);
      if (this.state.number.length !== 10) {
        this.setState({
          error: true,
          number: null,
          errormessage: "Please enter valid Mobile Number",
          loading: false
        });
        return false;
      }
    } else if (this.state.display === "otp") {
      if (this.state.number.length !== 6) {
        this.setState({
          error: true,
          number: null,
          errormessage: "Please enter valid 6 digit OTP",
          loading: false
        });
        return false;
      }
    }

    return true;
  };

  handleSignin = async () => {
    switch (this.state.display) {
      case "main":
        if (this.handleValidation()) {
          this.props.setPhoneNumber(this.state.number);

          this.setState({
            loading: true,
            currentlyEnteredNumber: this.state.number
          });

          const successfull = await this.props.startsigninPhone(
            this.state.number
          );

          if (successfull) {
            this.setState({ display: "otp", number: null, loading: false });
          } else {
            this.setState({
              number: null,
              loading: false,
              error: true,
              errormessage: "Cannot send SMS now. Please try again later"
            });
          }
        }
        break;

      case "otp":
        if (this.handleValidation()) {
          this.setState({ loading: true });

          let result;

          try {
            result = await window.confirmationResult.confirm(this.state.number);
          } catch (error) {
            this.setState({
              error: true,
              loading: false,
              errormessage: "Incorrect OTP Entered"
            });
          }
          console.log(result);
          if (result && !result.additionalUserInfo.isNewUser) {
            this.props.completeSignin(result);
          } else {
            this.setState({ display: "enterinfoscreen", result });
          }
        }
        break;

      case "enterinfoscreen":
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
        let result = this.state.result;
        result.name = this.state.displayName;
        firebase.auth().currentUser.updateProfile({
          displayName: this.state.displayName
        });
        this.props.completeSignin(result);
    }
  };

  componentDidMount() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "signinbutton",
      {
        size: "invisible",
        callback: function(response) {}
      }
    );
  }

  render() {
    if (this.state.display === "enterinfoscreen") {
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

          <Button onClick={this.handleSignin} label="Submit" marginTop="30px" />
        </Container>
      );
    }
    return (
      <Container>
        <Logo />
        {this.state.display === "otp" && (
          <EnterNumber>
            OTP sent to {this.state.currentlyEnteredNumber}{" "}
            <Underline
              onClick={() => this.setState({ display: "main", number: null })}
            >
              change
            </Underline>
          </EnterNumber>
        )}
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
          placeholder={
            this.state.display === "main" ? "Enter phone number" : "Enter OTP"
          }
          value={this.state.number}
          onChange={otp => this.setState({ number: otp, error: false })}
          maxLength={this.state.display === "main" ? "11" : "7"}
          country="IN"
        />

        {this.state.error && (
          <ErrorValidation>
            {this.state.errormessage
              ? this.state.errormessage
              : "Something went wrong. Please try again"}
          </ErrorValidation>
        )}

        {this.state.display === "otp" && (
          <HandleOTPResend
            startsigninPhone={() =>
              this.props.startsigninPhone(this.state.currentlyEnteredNumber)
            }
          />
        )}

        <Holder>
          {this.state.loading ? (
            <Loader />
          ) : (
            <Button label="Submit" onClick={this.handleSignin} />
          )}
          <Captcha id="signinbutton" onClick={this.handleSignin} />
        </Holder>
        <div style={{ height: "80px" }} />
      </Container>
    );
  }
}

class HandleOTPResend extends React.Component {
  state = {
    interval: null,
    countdown: 10,
    resendReady: false
  };

  componentDidMount() {
    const interval = setInterval(() => {
      if (this.state.countdown > 0) {
        this.setState({ countdown: this.state.countdown - 1 });
      } else {
        clearInterval(this.state.interval);
        this.setState({ resendReady: true });
      }
    }, 1000);
    this.setState({ interval });
  }

  render() {
    if (this.state.resendedOnce) return <EnterNumber>Resent OTP</EnterNumber>;
    return (
      <EnterNumber>
        Did not recieve OTP?{" "}
        {this.state.resendReady ? (
          <Underline
            onClick={() => {
              this.props.startsigninPhone();
              this.setState({ resendReady: false, resendedOnce: true });
            }}
          >
            Resend OTP
          </Underline>
        ) : (
          `Resend OTP in ${this.state.countdown}`
        )}
      </EnterNumber>
    );
  }
}

export default connect(
  null,
  {
    ...googleAuth,
    startsigninPhone,
    completeSignin
  }
)(SignIn);
