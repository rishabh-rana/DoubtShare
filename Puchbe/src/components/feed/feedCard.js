import React from "react";
import { firestore } from "../../config/firebase";
import ImageButton from "../ask/addImageButton";
import Button from "../ui/button";
import Loader from "../ui/loader/loader";
import styled from "styled-components";
import colorParser from "../ui/color/colorParser";

const Taglist = styled.div`
  font-size: 14px;
  padding: 8px 20px;
  background-color: #e0e0e0;
  display: inline-block;
  border-radius: 4px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding: 16px;
`;

const DisplayName = styled.div`
  font-size: 16px;
  color: grey;
  opacity: 0.8;
  display: inline-block;
`;

const ReaskCounter = styled.div`
  font-size: 16px;
  text-align: right;
`;

const SmallButtons = styled.div`
  font-size: 18px;
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
  color: grey;
  opacity: 0.8;
  font-size: 16px;
  margin-top: 25px;
`;

class FeedCard extends React.Component {
  state = {
    reasked: null,
    bookmarked: null,
    paginateAnswers: null,
    answers: [],
    loadingAnswers: false,
    feedDone: false,
    upvote: null
  };

  handlereask = (reasks, docid) => {
    // check if a change has been made to state of reask
    // if yes, check using state otherwise check using data from server
    if (this.state.reasked === null) {
      if (reasks[this.props.auth.uid] > 0) {
        delete reasks[this.props.auth.uid];
        this.props.reask(reasks, docid);
        this.setState({ reasked: false });
      } else {
        reasks[this.props.auth.uid] = Date.now();
        this.props.reask(reasks, docid);
        this.setState({ reasked: true });
      }
    } else {
      if (this.state.reasked) {
        delete reasks[this.props.auth.uid];
        this.props.reask(reasks, docid);
        this.setState({ reasked: false });
      } else {
        reasks[this.props.auth.uid] = Date.now();
        this.props.reask(reasks, docid);
        this.setState({ reasked: true });
      }
    }
  };

  handleUpvote = (increment, upvotes, downvotes, questionId, ansId) => {
    var voted = false;

    if (upvotes.indexOf(this.props.auth.uid) !== -1) voted = "upvoted";
    if (downvotes.indexOf(this.props.auth.uid) !== -1) voted = "downvoted";

    console.log(voted, upvotes, downvotes);

    const handleVoting = (incArray, decArray) => {
      incArray.push(this.props.auth.uid);
      if (decArray) decArray.splice(decArray.indexOf(this.props.auth.uid), 1);
      return { finalUpvotes: incArray, finalDownvotes: decArray };
    };

    if (voted === false) {
      if (increment) {
        handleVoting(upvotes, null);
        this.setState({ upvote: true });
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

  handleBookmark = (bookmarks, docid) => {
    // check if a change has been made to state of bookmark
    // if yes, check using state otherwise check using data from server
    if (this.state.bookmarked === null) {
      console.log("heyyyyyyy");
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
      const snap = await query.limit(3).get();

      var lastDoc = snap.docs[snap.docs.length - 1];
      if (lastDoc) {
        this.setState({ paginate: { lastDoc } });
      } else {
        this.setState({ feedDone: true });
      }

      if (snap.docs.length < 3) this.setState({ feedDone: true });

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
      console.log("Loaded all answers");
    }
  };

  componentDidMount() {
    this.getAnswers();
  }

  render() {
    console.log(this.state.bookmarked);
    let { dat } = this.props;

    return (
      <div style={{ height: window.screen.height }}>
        <div
          style={{
            height: "auto",
            backgroundColor: "#fff",
            padding: "16px"
          }}
        >
          <Taglist>
            {Object.keys(dat.tags).map(tag => {
              if (tag.indexOf("$") === -1)
                return <span key={tag}>#{tag} </span>;
            })}
          </Taglist>
        </div>

        {dat.image && (
          <a href={dat.image} target="_blank">
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
          </a>
        )}

        <Row>
          <DisplayName>by {dat.uploader.displayName}</DisplayName>
          <ReaskCounter>
            {Object.keys(dat.reAsks).length}{" "}
            <DisplayName> {" Reasks"}</DisplayName>
          </ReaskCounter>
        </Row>

        <Row>
          <div style={{ flexGrow: 9 }}>
            <ImageButton
              label="Answer"
              color="dark"
              setImage={this.props.setImage}
              onChangeHandler={() =>
                this.props.changeAnswerMode(true, dat.docid)
              }
            />
          </div>
          <SmallButtons
            active={
              this.state.bookmarked !== null
                ? this.state.bookmarked
                : dat.bookmarks.hasOwnProperty(this.props.auth.uid)
            }
            onClick={() => this.handleBookmark(dat.bookmarks, dat.docid)}
          >
            <i className="fas fa-bookmark" />
          </SmallButtons>
          <SmallButtons
            active={
              this.state.reasked !== null
                ? this.state.reasked
                : dat.reAsks.hasOwnProperty(this.props.auth.uid)
            }
            onClick={() => this.handlereask(dat.reAsks, dat.docid)}
          >
            <i className="fas fa-sync-alt" />
          </SmallButtons>
        </Row>
        <AnswersIndicatorText>Answers</AnswersIndicatorText>
        <ChevronDown>
          <i className="fas fa-chevron-down" />
        </ChevronDown>

        {this.state.answers.map((ans, i) => {
          return (
            <div key={i} style={{ marginBottom: "20px" }}>
              {ans.type === "image" && (
                <img
                  src={ans.file}
                  width={window.screen.width}
                  className="filterFocus"
                />
              )}
              {ans.type === "video" && (
                <video
                  id={ans.file}
                  onPlay={() => this.props.handleVideoPlay(ans.file)}
                  src={ans.file}
                  controls
                  width={window.screen.width}
                  className="filterFocus"
                />
              )}
              <div
                style={{
                  marginBottom: "5px"
                }}
              >
                <Row>
                  <div style={{ flexGrow: 6, paddingTop: "7px" }}>
                    <DisplayName>by {ans.uploader.displayName}</DisplayName>
                  </div>

                  <SmallButtons
                    onClick={() =>
                      this.handleUpvote(
                        true,
                        ans.upvotes,
                        ans.downvotes,
                        dat.docid,
                        ans.docid
                      )
                    }
                    active={
                      this.state.upvote === null
                        ? ans.upvotes.indexOf(this.props.auth.uid) !== -1
                        : this.state.upvote
                    }
                  >
                    <i className="fas fa-arrow-up" /> {ans.upvotes.length}
                  </SmallButtons>
                  <SmallButtons
                    onClick={() =>
                      this.handleUpvote(
                        false,
                        ans.upvotes,
                        ans.downvotes,
                        dat.docid,
                        ans.docid
                      )
                    }
                    active={
                      this.state.upvote === null
                        ? ans.downvotes.indexOf(this.props.auth.uid) !== -1
                        : !this.state.upvote
                    }
                  >
                    <i className="fas fa-arrow-down" /> {ans.downvotes.length}
                  </SmallButtons>
                </Row>
                <Description>{ans.description}</Description>
              </div>
            </div>
          );
        })}
        {this.state.loadingAnswers ? null : this.state.feedDone ? (
          <div style={{ padding: "5px" }}>
            <AnswersIndicatorText>No more Answers</AnswersIndicatorText>
          </div>
        ) : (
          <div style={{ padding: "5px" }}>
            <Button
              onClick={this.getAnswers}
              label="Load more Answers"
              color="primary"
              inverted
            />
          </div>
        )}
      </div>
    );
  }
}

const DescriptionHolder = styled.div`
  padding: 5px;
`;

const ShowMoreDescription = styled.div`
  opacity: 0.8;
  color: grey;
  font-size: 16px;
  margin-top: 5px;
`;

class Description extends React.Component {
  state = {
    open: false
  };

  render() {
    let displayMessage;
    let big = false;
    let message = this.props.children;
    if (message.length > 90) {
      big = true;
      displayMessage = message.slice(0, 50) + "...";
    } else {
      displayMessage = message;
    }

    if (this.state.open) displayMessage = message;

    return (
      <DescriptionHolder>
        {displayMessage}
        {big && (
          <ShowMoreDescription
            onClick={() => this.setState({ open: !this.state.open })}
          >
            {this.state.open ? "hide" : "show more"}
          </ShowMoreDescription>
        )}
      </DescriptionHolder>
    );
  }
}

export default FeedCard;
