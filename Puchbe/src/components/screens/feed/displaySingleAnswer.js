import React from "react";
import styled from "styled-components";
import mixpanel from "../../../config/mixpanel";
import Button from "../../ui/button";

import colorParser from "../../ui/color/colorParser";

const DisplayName = styled.div`
  font-size: 14px;
  color: grey;
  opacity: 0.8;
  display: inline-block;
  text-decoration: underline;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding: 16px;
`;

const UpVoteButton = styled.div`
  font-size: 14px;
  padding: 5px;
  flex-grow: 1;
  text-align: center;
  color: ${props => (props.active ? colorParser("green") : "black")};
`;

const DownVoteButton = styled.div`
  font-size: 14px;
  padding: 5px;
  flex-grow: 1;
  text-align: center;
  color: ${props => (props.active ? colorParser("red") : "black")};
`;

class AnswerDiv extends React.Component {
  componentDidMount() {
    // let video = document.getElementById(this.props.ans.file);
    // video.addEventListener("play", async () => {
    //   console.log("started while loop");
    //   while (video.duration === Infinity) {
    //     console.log(video.classList);
    //     await new Promise(r => setTimeout(r, 100));
    //     video.currentTime = 10000000 * Math.random();
    //   }
    //   video.currentTime = 0;
    //   video.play();
    //   console.log("Done loading duration");
    // });
  }

  render() {
    var { ans, admins, dat } = this.props;
    return (
      <div style={{ marginBottom: "20px" }}>
        {
          <video
            type="video/webm"
            id={ans.file}
            className={Math.random() * 100}
            onPlay={() => {
              this.props.handleVideoPlay(ans.file);
              mixpanel.track("playedAnswerVideo");
            }}
            src={ans.file}
            onPause={() => mixpanel.track("pausedAnswerVideo")}
            controls
            width="100%"
          />
        }
        <div
          style={{
            marginBottom: "5px"
          }}
        >
          <Row>
            <div style={{ flexGrow: 6, paddingTop: "7px" }}>
              <DisplayName
                onClick={() => {
                  mixpanel.track("pressedDisplayNameInAnswerNonClickableArea");
                  if (ans.uploader.uid !== this.props.auth.uid) {
                    this.props.history.push(
                      "/view_profile/" + ans.uploader.uid
                    );
                  }
                }}
              >
                by {ans.uploader.displayName}
              </DisplayName>
            </div>

            <UpVoteButton
              onClick={() =>
                this.props.handleUpvote(
                  true,
                  ans.upvotes,
                  ans.downvotes,
                  dat.docid,
                  ans.docid,
                  ans
                )
              }
            >
              <i className="fas fa-arrow-up" /> {ans.upvotes.length}
            </UpVoteButton>
            <DownVoteButton
              onClick={() =>
                this.props.handleUpvote(
                  false,
                  ans.upvotes,
                  ans.downvotes,
                  dat.docid,
                  ans.docid,
                  ans
                )
              }
            >
              <i className="fas fa-arrow-down" /> {ans.downvotes.length}
            </DownVoteButton>
          </Row>

          {admins.indexOf(this.props.auth && this.props.auth.uid) !== -1 && (
            <Row>
              <Button
                label="Delete Answer"
                onClick={() =>
                  this.props.deleteAnswer(ans, dat.docid, ans.docid)
                }
                color="red"
              />
            </Row>
          )}

          <Description
            onClick={() => mixpanel.track("pressedDescriptionBoxInAnswers")}
          >
            {ans.description}
          </Description>
        </div>
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

export default AnswerDiv;
