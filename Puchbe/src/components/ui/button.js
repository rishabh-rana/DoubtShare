import React from "react";
import styled, { css } from "styled-components";
import colorParser from "./color/colorParser";
import propTypes from "prop-types";
import mixpanel from "../../config/mixpanel";

const BtnTemplate = styled.button`
  border: none;
  width: ${props => props.width};
  border-radius: 4px;
  background: ${props => props.color};
  color: white;
  padding: 7px;
  text-align: center;
  font-size: 20px;
  margin-top: ${props => props.marginTop};

  ${props =>
    props.inverted &&
    css`
      background: transparent;
      border: 2px solid ${props => props.color};
      color: ${props => props.color};
    `}
`;

const Button = props => {
  // pull basic props
  let {
    color,
    label,
    width,
    inverted,
    marginTop,
    onClick,
    mixpanelLabel
  } = props;

  if (!mixpanelLabel) mixpanelLabel = label;

  // parse standard colors to hex values
  color = colorParser(color);

  return (
    <BtnTemplate
      color={color}
      inverted={inverted}
      width={width}
      marginTop={marginTop}
      onClick={() => {
        mixpanel.track(mixpanelLabel);
        onClick();
      }}
    >
      {label}
    </BtnTemplate>
  );
};

Button.propTypes = {
  color: propTypes.string,
  label: propTypes.string,
  width: propTypes.string,
  inverted: propTypes.bool,
  marginTop: propTypes.string,
  onClick: propTypes.func,
  mixpanelLabel: propTypes.string
};

Button.defaultProps = {
  color: "primary",
  label: "Action",
  width: "100%",
  inverted: false,
  marginTop: "0px",
  onClick: () => {}
};

export default Button;
