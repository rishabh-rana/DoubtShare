import React from "react";
import styled from "styled-components";
import colorParser from "../ui/color/colorParser";
import Loader from "./loader/loader";

const Container = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  padding-top: 80px;
`;

const PointPlus = styled.div`
  width: 80%;
  font-size: 150px;
  color: ${colorParser("green")};
  margin: 0 auto;
  margin-top: 20px;
`;
const PointPlusSubText = styled.div`
  width: 80%;
  font-size: 20px;
  color: ${colorParser("grey")};
  opacity: 0.8;
  margin: 0 auto;
  margin-top: 5px;
`;

const Message = styled.div`
  width: 80%;
  font-size: 25px;
  color: ${colorParser("black")};
  opacity: 0.6;
  margin: 0 auto;
  margin-top: 100px;
  margin-bottom: 20px;
`;

const PlusPointsCard = props => {
  return (
    <Container>
      <PointPlus>+{props.points}</PointPlus>
      <PointPlusSubText>Points</PointPlusSubText>
      <Message>{`Uploading ${
        props.points === "1" ? "Question" : "Answer"
      } ...`}</Message>
      <Loader />
    </Container>
  );
};

export default PlusPointsCard;
