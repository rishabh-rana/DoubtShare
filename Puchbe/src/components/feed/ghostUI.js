import React from "react";
import FeedCard from "./feedCard";

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
        <div style={{ background: "rgb(70,70,70)", filter: "blur(1px)" }}>
          <FeedCard ghostUI={true} />
        </div>
      </React.Fragment>
    );
  }
}
export default GhostUIFeedCard;
