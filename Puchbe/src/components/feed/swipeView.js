import React from "react";
import ReactSwipe from "react-swipeable-views";
import mixpanel from "../../config/mixpanel";
import colorParser from "../ui/color/colorParser";

const SwipeCards = props => {
  return (
    <div style={{ overflow: "hidden", backgroundColor: colorParser("dark") }}>
      <ReactSwipe
        resistance={true}
        index={props.index}
        onChangeIndex={(ni, i) => {
          if (ni === 0) {
            setTimeout(() => {
              props.flushFeed();
              props.getFeed();
            }, 200);
          }
          if (i > ni) mixpanel.track("swipedBackInFeed");
          if (ni > i) mixpanel.track("swipedForwardInFeed");
          props.changeCardIndex(ni);
          props.handleVideoPlay(null);
        }}
      >
        {props.children}
      </ReactSwipe>
    </div>
  );
};
export default SwipeCards;
