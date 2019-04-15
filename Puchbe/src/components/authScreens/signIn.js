import React from "react";
import { connect } from "react-redux";
import * as googleAuth from "../../actions/auth/googleAuth";
import styled from "styled-components";

const Google = styled.img`
  width: 80%;
  margin-top: 50px;
`;

const MoreOptions = styled.div`
  margin-top: 30px;
  color: grey;
  opacity: 0.8;
  font-size: 16px;
  text-align: center;
`;

const SignIn = props => {
  return (
    <div style={{ textAlign: "center" }}>
      <Google onClick={props.signin} src="./googleSigninButton.png" />
      <MoreOptions>more options coming soon ...</MoreOptions>
    </div>
  );
};
export default connect(
  null,
  {
    ...googleAuth
  }
)(SignIn);
