import React from "react";
import ReactSwipe from "react-swipeable-views";
import mixpanel from "../../config/mixpanel";

const SwipeCards = props => {
  return (
    <div style={{ overflow: "hidden" }}>
      <ReactSwipe
        resistance={true}
        index={props.index}
        onChangeIndex={(ni, i) => {
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
