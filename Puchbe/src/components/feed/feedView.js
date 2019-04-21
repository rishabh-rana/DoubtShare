import React from "react";
import SwipeView from "./swipeView";
import FeedCard from "./feedCard";
import { connect } from "react-redux";
import * as action from "../../actions/feed/getFeedChron";
import { deleteAnswer } from "../../actions/answer/answerQuestion";
import { deleteQuestion } from "../../actions/ask/askQuestion";
import Fullmessage from "../profile/Fullmessage";
import AnswerBox from "../answer/answerBox";
import GhostUIFeedCard from "./ghostUI";

class FeedView extends React.Component {
  state = {
    cardIndex: 1,
    answerMode: false,
    answeringDoc: null,
    answerImage: null,
    activeVideo: null
  };

  handleVideoPlay = id => {
    if (this.state.activeVideo && this.state.activeVideo !== id) {
      document.getElementById(this.state.activeVideo).pause();
    }

    this.setState({ activeVideo: id });
  };

  changeCardIndex = i => {
    if (i === this.props.feed.length) {
      console.log("hey");
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

  componentDidMount() {
    document.querySelector("html").scrollTop = 0;
    document.querySelector("body").style.overflowY = "hidden";
  }

  componentWillUnmount() {
    document.querySelector("html").scrollTop = 0;
    document.querySelector("body").style.overflowY = "scroll";
  }

  render() {
    if (this.state.answerMode) {
      return (
        <AnswerBox
          changeAnswerMode={this.changeAnswerMode}
          answeringDoc={this.state.answeringDoc}
          answerImage={this.state.answerImage}
          setImage={image => this.setState({ answerImage: image })}
        />
      );
    }
    return (
      <SwipeView
        index={this.state.cardIndex}
        getFeed={this.props.getFeed}
        flushFeed={this.props.flushFeed}
        changeCardIndex={this.changeCardIndex}
        handleVideoPlay={id => this.handleVideoPlay(id)}
        singleQues={this.props.singleQues}
      >
        {<GhostUIFeedCard />}
        {this.props.feed.map((dat, index) => {
          return (
            <FeedCard
              deleteAnswer={this.props.deleteAnswer}
              deleteQuestion={this.props.deleteQuestion}
              history={this.props.history}
              setFilter={this.props.setFilter}
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
        {!this.props.feedDone ? (
          <GhostUIFeedCard />
        ) : (
          <Fullmessage message="Feed is Over" />
        )}
      </SwipeView>
    );
  }
}

const mapstate = state => {
  return {
    feed: state.feed.data,
    auth: state.auth,
    paginate: state.feed.paginate,
    feedDone: state.feed.paginate.feedDone
  };
};

export default connect(
  mapstate,
  { ...action, deleteAnswer, deleteQuestion }
)(FeedView);
