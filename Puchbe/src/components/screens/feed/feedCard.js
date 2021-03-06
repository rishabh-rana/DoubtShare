import React from "react";
import firebase from "firebase/app";
import { firestore } from "../../../config/firebase";
import ImageButton from "../../filepicker/addImageButton";
import Button from "../../ui/button";
import Loader from "../../ui/loader/loader";
import styled from "styled-components";
import colorParser from "../../ui/color/colorParser";
import mixpanel from "../../../config/mixpanel";

import { admins } from "../../../admins";
import ErrorBoundary from "../../errorHandler/ErrorBoundary";
import AnswerDiv from "./displaySingleAnswer";

const Ques = styled.h6`
  font-size: 14px;
  margin: 0;
  padding: 0;
  color: ${colorParser("dark")};
`;

const VerySmallText = styled.div`
  font-size: 10px;
  margin-top: 2px;
  display: block;
  text-align: center;
`;

const Taglist = styled.div`
  font-size: 12px;
  padding: 8px 20px;
  background-color: #e0e0e0;
  display: inline-block;
  border-radius: 4px;
  margin: 16px 0 0 0;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding: 16px;
`;

const DisplayName = styled.div`
  font-size: 14px;
  text-decoration: underline;
  color: grey;
  opacity: 0.8;
  display: inline-block;
`;

const ReaskCounter = styled.div`
  font-size: 14px;
  text-align: right;
`;

const SmallButtons = styled.div`
  font-size: 14px;
  padding: 5px;
  flex-grow: 1;
  text-align: center;
  color: ${props => (props.active ? colorParser("primary") : "black")};
`;

const ChevronDown = styled.div`
  text-align: center;
  color: grey;
  opacity: 0.8;
  font-size: 20px;
  margin-bottom: 10px;
`;

const AnswersIndicatorText = styled.div`
  text-align: center;
  color: ${colorParser("dark")};
  opacity: 0.3;
  font-size: 14px;
  margin-top: 25px;
`;

const GhostUIOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10000;
  background: transparent;
`;

class FeedCard extends React.Component {
  constructor(props) {
    super(props);
    this.scrollDiv = React.createRef();
  }

  state = {
    reasked: null,
    bookmarked: null,
    paginateAnswers: null,
    answers: [],
    loadingAnswers: false,
    feedDone: false,
    upvote: null
  };

  handlereask = (reasks, docid, dat) => {
    // check if a change has been made to state of reask
    // if yes, check using state otherwise check using data from server
    mixpanel.track("presedReaskedQuestionButton");
    if (this.state.reasked === null) {
      if (reasks[this.props.auth.uid] > 0) {
        delete reasks[this.props.auth.uid];
        this.props.reask(reasks, docid);
        this.setState({ reasked: false });
        this.grantReaskPoints(dat, false);
      } else {
        reasks[this.props.auth.uid] = Date.now();
        this.props.reask(reasks, docid);
        this.setState({ reasked: true });
        this.grantReaskPoints(dat, true);
      }
    } else {
      if (this.state.reasked) {
        delete reasks[this.props.auth.uid];
        this.props.reask(reasks, docid);
        this.setState({ reasked: false });
        this.grantReaskPoints(dat, false);
      } else {
        reasks[this.props.auth.uid] = Date.now();
        this.props.reask(reasks, docid);
        this.setState({ reasked: true });
        this.grantReaskPoints(dat, true);
      }
    }
  };

  grantReaskPoints = async (ques, isAdd) => {
    if (isAdd) {
      firestore
        .collection("users")
        .doc(ques.uploader.uid)
        .update({
          points: firebase.firestore.FieldValue.increment(1)
        });
    } else {
      firestore
        .collection("users")
        .doc(ques.uploader.uid)
        .update({
          points: firebase.firestore.FieldValue.increment(-1)
        });
    }
  };

  handleUpvote = (increment, upvotes, downvotes, questionId, ansId, ans) => {
    var voted = false;

    if (upvotes.indexOf(this.props.auth.uid) !== -1) voted = "upvoted";
    if (downvotes.indexOf(this.props.auth.uid) !== -1) voted = "downvoted";

    const handleVoting = (incArray, decArray) => {
      incArray.push(this.props.auth.uid);
      if (decArray) decArray.splice(decArray.indexOf(this.props.auth.uid), 1);
      return { finalUpvotes: incArray, finalDownvotes: decArray };
    };

    if (voted === false) {
      if (increment) {
        handleVoting(upvotes, null);
        this.setState({ upvote: true });
        this.grantUpvotePoints(ans);
      } else {
        handleVoting(downvotes, null);
        this.setState({ upvote: false });
      }
    } else if (voted === "downvoted") {
      if (increment) {
        handleVoting(upvotes, downvotes);
        this.setState({ upvote: true });
      } else {
        return;
      }
    } else if (voted === "upvoted") {
      if (!increment) {
        handleVoting(downvotes, upvotes);
        this.setState({ upvote: false });
      } else {
        return;
      }
    }

    this.props.upvote(questionId, ansId, upvotes, downvotes);
  };

  grantUpvotePoints = async ans => {
    firestore
      .collection("users")
      .doc(ans.uploader.uid)
      .update({
        points: firebase.firestore.FieldValue.increment(1)
      });
  };

  handleBookmark = (bookmarks, docid) => {
    mixpanel.track("presedBookmarkButton");
    // check if a change has been made to state of bookmark
    // if yes, check using state otherwise check using data from server
    if (this.state.bookmarked === null) {
      if (bookmarks[this.props.auth.uid] > 0) {
        let newmarks = { ...bookmarks };
        delete newmarks[this.props.auth.uid];
        this.props.bookmarkques(newmarks, docid);
        this.setState({ bookmarked: false });
      } else {
        let newmarks = { ...bookmarks };
        newmarks[this.props.auth.uid] = Date.now();
        this.props.bookmarkques(newmarks, docid);
        this.setState({ bookmarked: true });
      }
    } else {
      if (this.state.bookmarked) {
        let newmarks = { ...bookmarks };
        delete newmarks[this.props.auth.uid];
        this.props.bookmarkques(newmarks, docid);
        this.setState({ bookmarked: false });
      } else {
        let newmarks = { ...bookmarks };
        newmarks[this.props.auth.uid] = Date.now();
        this.props.bookmarkques(newmarks, docid);
        this.setState({ bookmarked: true });
      }
    }
  };

  getAnswers = async () => {
    this.setState({ loadingAnswers: true });
    let answers = [];
    let newFeed = false;
    let query = firestore
      .collection("questions")
      .doc(this.props.dat.docid)
      .collection("answers")
      .orderBy("timestamp", "desc");

    if (this.state.answers.length !== 0) {
      query = query.startAfter(this.state.paginate.lastDoc);
    } else {
      newFeed = true;
    }

    if (
      (this.state.paginate && this.state.feedDone !== true) ||
      !this.state.paginate
    ) {
      const snap = await query.limit(2).get();

      var lastDoc = snap.docs[snap.docs.length - 1];
      if (lastDoc) {
        this.setState({ paginate: { lastDoc } });
      } else {
        this.setState({ feedDone: true });
      }

      if (snap.docs.length < 2) this.setState({ feedDone: true });

      snap.forEach(doc => {
        answers.push({
          ...doc.data(),
          docid: doc.id
        });
      });

      if (newFeed) {
        this.setState({ answers: answers, loadingAnswers: false });
      } else {
        this.setState({
          answers: [...this.state.answers, ...answers],
          loadingAnswers: false
        });
      }
    } else {
      // do something
    }
  };

  handleTagPress = tag => {
    mixpanel.track("pressedTagButtonOnFeedCard");
    this.props.history.push("/search");
    this.props.setFilter(tag);
  };

  componentDidMount() {
    if (this.props.ghostUI) return;
    this.getAnswers();
  }

  render() {
    let { dat } = this.props;

    return (
      <ErrorBoundary>
        <GhostUIOverlay />
        <div
          style={{
            height: parseInt(window.screen.height) + "px",
            filter: this.props.ghostUI && "grayscale(100%)",
            paddingTop: "2vh"
          }}
        >
          <div
            ref={this.scrollDiv}
            className="hello1"
            style={{
              overflow: "auto",
              backgroundColor: "#fcfcfc",
              width: "92vw",
              margin: "0 auto 0 auto",
              borderRadius: "12px",
              boxShadow: "0px 0px 12px -6px rgba(0, 0, 0, 0.2)"
            }}
          >
            <div
              style={{
                overflow: "auto",
                backgroundColor: "null",
                padding: "16px",
                paddingTop: "32px"
              }}
            >
              <Ques
                onClick={() =>
                  mixpanel.track("clickedOnQuestionNonClickableArea")
                }
              >
                Question: {dat && dat.title}
              </Ques>
              <Taglist>
                {this.props.ghostUI && <span>#topics</span>}
                {dat &&
                  dat.tags &&
                  Object.keys(dat.tags).map(tag => {
                    if (tag.indexOf("$") === -1)
                      return (
                        <span
                          key={tag}
                          onClick={() => this.handleTagPress(tag)}
                        >
                          #{tag}{" "}
                        </span>
                      );
                  })}
              </Taglist>
            </div>

            {
              <div
                style={{
                  minHeight: "160px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <a
                  href={dat && dat.image}
                  target="_blank"
                  onClick={() => mixpanel.track("pressedOnImageInFeedCard")}
                >
                  {this.props.ghostUI && <Loader />}
                  {this.props.ghostUI !== true && dat && dat.image && (
                    <img
                      src={dat.image}
                      alt="Loading"
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block"
                      }}
                      className="filterFocus"
                    />
                  )}
                </a>
              </div>
            }

            <Row>
              <DisplayName
                onClick={() => {
                  mixpanel.track("pressedDisplayNameNonClickableArea");
                  if (dat.uploader.uid !== this.props.auth.uid) {
                    this.props.history.push(
                      "/view_profile/" + dat.uploader.uid
                    );
                  }
                }}
              >
                by {dat && dat.uploader && dat.uploader.displayName}{" "}
                {this.props.ghostUI && "team Doubtshare"}
              </DisplayName>
              <ReaskCounter
                onClick={() =>
                  mixpanel.track("pressedNumberOfReasksNonClickableArea")
                }
              >
                {dat && dat.reAsks && Object.keys(dat.reAsks).length}{" "}
                {this.props.ghostUI && "24 "}
                <DisplayName> {" Reasks"}</DisplayName>
              </ReaskCounter>
            </Row>

            <Row>
              <div style={{ flexGrow: 9 }}>
                <ImageButton
                  label="Answer Question"
                  color="dark"
                  setImage={this.props.setImage}
                  onChangeHandler={() => {
                    mixpanel.track("startedAnsweringQuestion");
                    this.props.changeAnswerMode(true, dat.docid);
                  }}
                />
              </div>
              <SmallButtons
                active={
                  this.state.bookmarked !== null
                    ? this.state.bookmarked
                    : dat &&
                      dat.bookmarks.hasOwnProperty(
                        this.props.auth && this.props.auth.uid
                      )
                }
                onClick={() => this.handleBookmark(dat.bookmarks, dat.docid)}
              >
                <i className="fas fa-bookmark" />

                <VerySmallText>Bookmark</VerySmallText>
              </SmallButtons>
              <SmallButtons
                active={
                  this.state.reasked !== null
                    ? this.state.reasked
                    : dat &&
                      dat.reAsks.hasOwnProperty(
                        this.props.auth && this.props.auth.uid
                      )
                }
                onClick={() => this.handlereask(dat.reAsks, dat.docid, dat)}
              >
                <i className="fas fa-sync-alt" />
                <VerySmallText>Reask</VerySmallText>
              </SmallButtons>
            </Row>

            {admins.indexOf(this.props.auth && this.props.auth.uid) !== -1 && (
              <React.Fragment>
                <Row>
                  <Button
                    label="Edit Picture"
                    onClick={() =>
                      this.props.history.push("/editPictureAdmin/" + dat.docid)
                    }
                    color="red"
                  />
                </Row>
                <Row>
                  <Button
                    label="Delete Question"
                    onClick={() => this.props.deleteQuestion(dat, dat.docid)}
                    color="red"
                  />
                </Row>
              </React.Fragment>
            )}
            <div
              onClick={() => {
                console.log(this.scrollDiv.current.scrollTop);
              }}
            >
              <AnswersIndicatorText
                onClick={() =>
                  mixpanel.track("pressedAnswersIndicatorTextNonClickableArea")
                }
              >
                Answers
              </AnswersIndicatorText>
              <ChevronDown
                onClick={() =>
                  mixpanel.track("pressedAnswersIndicatorTextNonClickableArea")
                }
              >
                <i className="fas fa-chevron-down" />
              </ChevronDown>
            </div>

            {this.state.answers.map((ans, i) => {
              return (
                <AnswerDiv
                  key={i}
                  history={this.props.history}
                  ans={ans}
                  handleVideoPlay={this.props.handleVideoPlay}
                  handleUpvote={this.handleUpvote}
                  deleteAnswer={this.props.deleteAnswer}
                  admins={admins}
                  auth={this.props.auth}
                  dat={dat}
                />
              );
            })}
            {this.state.feedDone ? (
              <div style={{ padding: "5px" }}>
                <AnswersIndicatorText>No more Answers</AnswersIndicatorText>
              </div>
            ) : (
              <div style={{ padding: "5px 25px" }}>
                <Button
                  onClick={this.getAnswers}
                  label="Load more Answers"
                  color="dark"
                />
              </div>
            )}
            <div style={{ height: "150px" }} />
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default FeedCard;
