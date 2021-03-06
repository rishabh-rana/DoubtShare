import React from "react";
import styled from "styled-components";
import Button from "../ui/button";
// import AddImageButton from "../ask/addImageButton";
import SignaturePad from "signature_pad";
import Help from "../ui/overlayHelp";
import Loader from "../ui/loader/loader";

import ErrorBoundary from "../../components/errorHandler/ErrorBoundary";
import HelpBanner from "../ui/helpBanner";

const StopBtn = styled.button`
  border: none;
  border-radius: 100%;
  background: salmon;
  position: fixed;
  bottom: 100px;
  left: 45%;
`;

const StartStopHolder = styled.div`
  position: fixed;
  bottom: 80px;
  left: 15px;
  right: 15px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const CenterBox = styled.div`
  min-height: ${parseInt(window.screen.availHeight) - 80 + "px"};
  background: rgba(0, 0, 0, 0.6);
`;

class WhiteBoard extends React.Component {
  state = {
    URLFINAL: null,
    recording: false,
    startingRecording: false,
    showHelp: false
  };

  mediaRecorder = null;
  recordedBlobs = [];
  sourceBuffer = null;
  mediaSource = new MediaSource();

  stream = null;

  signaturePad = null;
  myctx = null;
  w = 0;
  h = 0;
  activeImage = null;

  handleSourceOpen = event => {
    this.sourceBuffer = this.mediaSource.addSourceBuffer(
      'video/webm; codecs="vp8"'
    );
  };

  handleDataAvailable = event => {
    if (event.data && event.data.size > 0) {
      console.log(event.data);
      this.recordedBlobs.push(event.data);
    }
  };

  handleStop = event => {
    const superBuffer = new Blob(this.recordedBlobs, { type: "video/webm" });
    this.setState({
      URLFINAL: window.URL.createObjectURL(superBuffer)
    });
    this.props.setFile(window.URL.createObjectURL(superBuffer));
  };

  sendSynthTouchEvent() {
    this.myctx.fillRect(10, 10, 1, 1);
  }

  stopRecording = () => {
    this.sendSynthTouchEvent();
    this.sendSynthTouchEvent();
    this.sendSynthTouchEvent();
    this.sendSynthTouchEvent();
    setTimeout(() => {
      this.mediaRecorder.stop();
    }, 200);
    //   console.log("Recorded Blobs: ", recordedBlobs);
    //   video.controls = true;
  };

  startRecording = () => {
    let options = { mimeType: "video/webm" };
    this.recordedBlobs = [];
    try {
      this.mediaRecorder = new MediaRecorder(this.stream, options);
    } catch (e0) {
      console.log("Unable to create MediaRecorder with options Object: ", e0);
      try {
        options = { mimeType: "video/webm,codecs=vp9" };
        this.mediaRecorder = new MediaRecorder(this.stream, options);
      } catch (e1) {
        console.log("Unable to create MediaRecorder with options Object: ", e1);
        try {
          options = "video/vp8"; // Chrome 47
          this.mediaRecorder = new MediaRecorder(this.stream, options);
        } catch (e2) {
          alert(
            "MediaRecorder is not supported by this browser.\n\n" +
              "Try Firefox 29 or later, or Chrome 47 or later, " +
              "with Enable experimental Web Platform features enabled from chrome://flags."
          );
          console.error("Exception while creating MediaRecorder:", e2);
          return;
        }
      }
    }
    console.log(
      "Created MediaRecorder",
      this.mediaRecorder,
      "with options",
      options
    );
    //   recordButton.textContent = "Stop Recording";
    //   playButton.disabled = true;
    //   downloadButton.disabled = true;
    this.mediaRecorder.onstop = this.handleStop;
    this.mediaRecorder.ondataavailable = this.handleDataAvailable;
    this.mediaRecorder.start(100); // collect 100ms of data
    this.setState({ startingRecording: false });
    console.log("MediaRecorder started", this.mediaRecorder);
  };

  resetCanvas = () => {
    this.signaturePad.clear();
    this.myctx.drawImage(
      document.getElementById("myimg"),
      0,
      0,
      this.w,
      this.h
    );
  };

  // changeImage = forward => {
  //   console.log(this.props.image.length);
  //   if (forward) {
  //     if (this.activeImage < this.props.image.length - 1) {
  //       this.activeImage += 1;
  //     } else {
  //       return;
  //     }
  //   } else {
  //     if (this.activeImage > 0) {
  //       this.activeImage -= 1;
  //     } else {
  //       return;
  //     }
  //   }
  //   console.log(this.activeImage);
  //   var img = document.getElementById("myimg");
  //   img.style.display = "block";

  //   img.src = this.props.image[this.activeImage];
  //   this.h = img.clientHeight;
  //   img.style.display = "none";

  //   this.resetCanvas();
  // };

  componentDidMount() {
    const firstTime = localStorage.getItem("help2");
    if (firstTime !== "shown") {
      localStorage.setItem("help2", "shown");
      this.setState({
        showHelp: true
      });
    }

    this.activeImage = 0;

    var canvas = document.querySelector("#sketchpad");
    this.myctx = canvas.getContext("2d");

    this.signaturePad = new SignaturePad(canvas, {
      penColor: "black"
    });

    setTimeout(() => {
      var img = document.getElementById("myimg");
      this.w = img.clientWidth;
      this.h = img.clientHeight;

      img.style.display = "none";
      this.resetCanvas();
    });

    canvas.addEventListener("touchend", this.resetCanvas);

    // STATR RECORD

    this.mediaSource.addEventListener(
      "sourceopen",
      this.handleSourceOpen,
      false
    );

    this.stream = canvas.captureStream(); // frames per second
    let holder = this.stream;

    var handleSuccess = function(Astream) {
      var audioTrack = Astream.getTracks().filter(function(track) {
        return track.kind === "audio";
      })[0];

      holder.addTrack(audioTrack);
    };

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(handleSuccess);

    // END RECORD
  }

  render() {
    console.log(this.props.image);

    if (this.state.URLFINAL !== null) {
      return (
        <div>
          <video
            src={this.state.URLFINAL}
            playsInline
            loop
            className="filterFocus"
          />
        </div>
      );
    }

    return (
      <React.Fragment>
        <ErrorBoundary
          message={
            "Looks like your browser is incompatible. Use Google Chrome for the best Experience"
          }
          trial="Hello"
        >
          {!this.state.recording && (
            <HelpBanner
              message={
                <span>Draw using your finger to explain the answer.</span>
              }
            />
          )}
          {this.state.showHelp && (
            <Help
              message={
                <span>
                  <div>Use finger as pointer to explain.</div> Press Start
                  Recording when ready
                </span>
              }
            />
          )}
          <img
            src={this.props.image[0]}
            id={"myimg"}
            style={{ width: "100%" }}
          />
          <CenterBox>
            <canvas
              id="sketchpad"
              width={window.screen.width}
              height={window.screen.width * this.props.aspectRatio}
              className="filterFocus"
            />

            <StartStopHolder>
              <Button
                color="green"
                id="play"
                onClick={() => {
                  this.sendSynthTouchEvent();
                  this.setState({ recording: true }, () => {
                    this.startRecording();
                    this.sendSynthTouchEvent();
                    this.sendSynthTouchEvent();
                    setTimeout(() => {
                      this.sendSynthTouchEvent();
                      this.sendSynthTouchEvent();
                      this.sendSynthTouchEvent();
                      this.sendSynthTouchEvent();
                    }, 1000);
                  });
                }}
                label={"Start Recording"}
                width="48%"
                disabled={this.state.recording}
                fontSize="17px"
              />
              <Button
                color="red"
                id="record"
                onClick={() => {
                  this.stopRecording();
                }}
                label="Stop Recording"
                width="48%"
                disabled={!this.state.recording}
                fontSize="17px"
              />
            </StartStopHolder>
          </CenterBox>
        </ErrorBoundary>
      </React.Fragment>
    );
  }
}
export default WhiteBoard;
