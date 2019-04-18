import React from 'react';
import styled, { css } from "styled-components";
import colorParser from "../ui/color/colorParser";

const Bar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: auto;
  background: ${colorParser("primary")};
  margin: 0 auto;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  padding-left: 5%;
  padding-right: 5%;
  -webkit-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  -moz-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
`;

export default function header() {
  return (
    <React.Fragment>
      <Bar>
        <h4 style= {{
          margin: "20px auto",
          color: `${colorParser("light")}`
        }}>
          Pucho App
        </h4>
      </Bar>
      <div style = {{
        height: "58px",
        color: "null"
      }}>

      </div>
    </React.Fragment>
    

  )
}
