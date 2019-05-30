import React from "react";
import styled from "styled-components";
import colorParser from "../ui/color/colorParser";
import { withRouter } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  padding-top: 80px;
`;

const AskRound = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: ${colorParser("primary")};
  margin: 0 auto;
  margin-top: 80px;
  text-align: center;
`;
const AskRoundMainText = styled.div`
  font-size: 100px;
  padding-top: 60px;
  color: ${colorParser("white")};
  opacity: 0.8;
`;

const AskRoundSubText = styled.div`
  font-size: 17px;
  color: ${colorParser("black")};
  opacity: 0.6;
`;

const SubText = styled.div`
  font-size: 20px;
  color: ${colorParser("white")};
  margin-top: 30px;
`;

const GotoAskCard = props => {
  return (
    <Container>
      <AskRound
        onClick={() => {
          props.history.push("/ask");
        }}
      >
        <AskRoundMainText>ASK</AskRoundMainText>
        <AskRoundSubText>Your Doubts Now</AskRoundSubText>
      </AskRound>
      <SubText>
        Press the button above to ask your doubts and get answers
      </SubText>
    </Container>
  );
};

export default withRouter(GotoAskCard);
