import React from "react";
import styled from "styled-components";

const Main = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  padding-top: 60px;
  color: grey;
  opacity: 0.6;
  font-size: 30px;
`;

const Message = props => {
  return <Main>{props.message}</Main>;
};
export default Message;
