import React from "react";
import { firestore } from "../../config/firebase";
import ImageButton from "../ask/addImageButton";
import Button from "../ui/button";
import Loader from "../ui/loader/loader";
import styled from "styled-components";
import colorParser from "../ui/color/colorParser";

const Taglist = styled.div`

  font-size: 16px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding: 8px;
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
    reasked: false,
    bookmarked: null,
    paginateAnswers: null,
    answers: [],
    loadingAnswers: false,
    feedDone: false
  };

  handlereask = (reasks, docid) => {
    if (reasks.indexOf(this.props.auth.uid) === -1) {
      this.props.reask([...reasks, this.props.auth.uid], docid);
      this.setState({ reasked: true });
    }
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
      <div
        style={{
          height: window.screen.height - "60",
        }}
      >
      <div
        style= {{
          height: "auto",
          
          backgroundColor: "#ededed",
          padding: "24px",
          marginBottom: "12px"
        }}
      >
         <Taglist>
          {Object.keys(dat.tags).map(tag => {
            if (tag.indexOf("$") === -1) return <span key={tag}>#{tag} </span>;
          })}
        </Taglist>
      </div>
       
        <div
          style ={{
            width: "100vws", 
            minHeight: "60vh", 
            display: "flex", 
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignContent: "center",
            backgroundColor: "#333333"
          }}
        >
        {dat.image && (
          <img
            src={dat.image}
            alt="Loading"
            style={{ width: "95%", height: "auto", display: "block", margin: "0 auto" }}
            className="filterFocus"
          />
        )}
        </div>
        <Row>
          <DisplayName>by {dat.uploader.displayName}</DisplayName>
          <ReaskCounter>
            {dat.reAsks && this.state.reasked
              ? dat.reAsks.length + 1
              : dat.reAsks.length}{" "}
            <DisplayName>Reasks</DisplayName>
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
              dat.reAsks.indexOf(this.props.auth.uid) === -1
                ? this.state.reasked
                  ? true
                  : false
                : true
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
                  src={ans.file}
                  controls
                  width={window.screen.width}
                  className="filterFocus"
                />
              )}
              <div>Description : {ans.description}</div>
              <div>answered by {ans.uploader.displayName}</div>
            </div>
          );
        })}
        {this.state.loadingAnswers ? (
          <Loader />
        ) : this.state.feedDone ? (
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
export default FeedCard;