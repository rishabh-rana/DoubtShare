import React from "react";
import FeedCard from "./feedCard";
import colorParser from "../ui/color/colorParser";

class GhostUIFeedCard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div style={{ background: colorParser("dark"), filter: "blur(1px)" }}>
          <FeedCard ghostUI={true} />
        </div>
      </React.Fragment>
    );
  }
}
export default GhostUIFeedCard;
