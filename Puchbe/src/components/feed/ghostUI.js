import React from "react";
import FeedCard from "./feedCard";

class GhostUIFeedCard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div style={{ background: "rgb(70,70,70)", filter: "blur(1px)" }}>
          <FeedCard ghostUI={true} />
        </div>
      </React.Fragment>
    );
  }
}
export default GhostUIFeedCard;
