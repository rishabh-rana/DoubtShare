import React from "react";
import ReactSwipe from "react-swipeable-views";

const SwipeCards = props => {
  return (
    <ReactSwipe
      resistance={true}
      index={props.index}
      onChangeIndex={(ni, i) => {
        props.changeCardIndex(ni);
      }}
    >
      {props.children}
    </ReactSwipe>
  );
};
export default SwipeCards;
