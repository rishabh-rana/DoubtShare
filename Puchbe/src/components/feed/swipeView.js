import React from "react";
import ReactSwipe from "react-swipeable-views";

const SwipeCards = props => {
  return (
    <div style={{ overflow: "hidden" }}>
      <ReactSwipe
        resistance={true}
        index={props.index}
        onChangeIndex={(ni, i) => {
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
