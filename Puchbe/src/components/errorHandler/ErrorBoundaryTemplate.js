import React from "react";
import styled from "styled-components";

const Error = styled.div`
  padding: 20px;
  padding-top: 50px;
  font-size: 25px;
  color: grey;
  opacity: 0.7;
  text-align: center;
`;

const ErrorBoundaryTemplate = props => {
  // make a grapic and put it here, it should be fluid as it will be used at many points
  let message = "Something went wrong, please Reload the page";
  if (props.type === "whiteboard")
    message =
      "Seems like your browser doesnt support WebRTC. Try updating it or contact us.";
  return (
    <React.Fragment>
      <Error>
        {message}
        <div>
          <i className="fas fa-sync-alt" />
        </div>
      </Error>
    </React.Fragment>
  );
};
export default ErrorBoundaryTemplate;
