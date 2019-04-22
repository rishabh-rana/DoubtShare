import React from "react";
import styled from "styled-components";

const Holder = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  padding: 10px;
  font-size: 18px;
  background: white;
  opacity: 0.6;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const InfoHolder = styled.div`
  flex-grow: 1;
  text-align: center;
  padding: 10px;
`;

const Text = styled.div`
  flex-grow: 9;
`;

const HelpBanner = props => {
  return (
    <Holder>
      <InfoHolder>
        <i className="fas fa-info-circle" />
      </InfoHolder>
      <Text>{props.message}</Text>
    </Holder>
  );
};
export default HelpBanner;
