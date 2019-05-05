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
  let message = props.message || "Something went wrong, please Reload the page";

  return (
    <React.Fragment>
      <Error>
        {message}
        <div onClick={() => window.location.reload()}>
          <i className="fas fa-sync-alt" />
        </div>
      </Error>
    </React.Fragment>
  );
};
export default ErrorBoundaryTemplate;
