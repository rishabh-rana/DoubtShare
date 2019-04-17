import React from "react";
import SwipeView from "./swipeView";
import FeedCard from "./feedCard";
import { connect } from "react-redux";
import * as action from "../../actions/feed/getFeedChron";
import AnswerBox from "../answer/answerBox";

class FeedView extends React.Component {
  state = {
    cardIndex: 0,
    answerMode: false,
    answeringDoc: null,
    answerImage: null,
    activeVideo: null
  };

  handleVideoPlay = id => {
    if (this.state.activeVideo) {
      document.getElementById(this.state.activeVideo).pause();
    }

    this.setState({ activeVideo: id });
  };

  changeCardIndex = i => {
    if (i === this.props.feed.length - 1) {
      this.props.getFeed(this.props.filter, this.props.paginate);
    }
    this.setState({
      cardIndex: i
    });
  };

  changeAnswerMode = (mode, docid) => {
    this.setState({
      answerMode: mode,
      answeringDoc: docid
    });
  };
  render() {
    if (this.state.answerMode) {
      return (
        <AnswerBox
          changeAnswerMode={this.changeAnswerMode}
          answeringDoc={this.state.answeringDoc}
          answerImage={this.state.answerImage}
        />
      );
    }
    return (
      <SwipeView
        index={this.state.cardIndex}
        changeCardIndex={this.changeCardIndex}
        handleVideoPlay={id => this.handleVideoPlay(id)}
      >
        {this.props.feed.map((dat, index) => {
          return (
            <FeedCard
              upvote={this.props.upvote}
              dat={dat}
              key={index}
              reask={this.props.reask}
              auth={this.props.auth}
              bookmarkques={this.props.bookmarkques}
              changeAnswerMode={this.changeAnswerMode}
              setImage={image => this.setState({ answerImage: image })}
              handleVideoPlay={id => this.handleVideoPlay(id)}
            />
          );
        })}
      </SwipeView>
    );
  }
}

const mapstate = state => {
  return {
    feed: state.feed.data,
    auth: state.auth,
    paginate: state.feed.paginate
  };
};

export default connect(
  mapstate,
  action
)(FeedView);
