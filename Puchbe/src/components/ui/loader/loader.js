import React from "react";
import "./loader.css";

const Loader = props => {
  const marginTop = props.marginTop || 0;
  return (
    <div className="lds-ripple abs-center-x" style={{ marginTop: marginTop }}>
      <div />
      <div />
    </div>
  );
};
export default Loader;
