import React from "react";
import FeedCard from "./feedCard";
import colorParser from "../ui/color/colorParser";

class GhostUIFeedCard extends React.Component {
  componentDidMount() {
    document.querySelector("body").style.overflowY = "hidden";
    document.querySelector("body").scrollTop = 0;
  }
  componentWillUnmount() {
    document.querySelector("body").style.overflowY = "scroll";
  }
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
