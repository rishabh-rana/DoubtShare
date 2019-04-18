import React from "react";
import styled from "styled-components";
import Button from "../ui/button";
// import AddImageButton from "../ask/addImageButton";
import SignaturePad from "signature_pad";

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
  bottom: 60px;
  left: 15px;
  right: 15px;
`;

// const AddNewHolder = styled.div`
//   position: fixed;
//   bottom: 150px;
//   left: 15px;
//   right: 15px;
// `;

// const Row1 = styled.div`
//   display: flex;
//   justify-content: space-around;
//   position: fixed;
//   bottom: 60px;
//   left: 5px;
//   right: 5px;
// `;

class WhiteBoard extends React.Component {
  state = {
    URLFINAL: null,
    recording: false
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

  stopRecording = () => {
    this.mediaRecorder.stop();
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
          <StopBtn onClick={() => document.querySelector("video").play()}>
            Play
          </StopBtn>
        </div>
      );
    }

    return (
      <React.Fragment>
        <img src={this.props.image[0]} id={"myimg"} style={{ width: "100%" }} />
        <canvas
          id="sketchpad"
          width={window.screen.width}
          height={window.screen.width * this.props.aspectRatio}
          className="filterFocus"
        />

        {this.state.recording ? (
          <StartStopHolder>
            <Button
              color="red"
              id="record"
              onClick={() => {
                this.stopRecording();
              }}
              label="Stop Recording"
            />
          </StartStopHolder>
        ) : (
          <StartStopHolder>
            <Button
              color="green"
              id="play"
              onClick={() => {
                this.setState({ recording: true });
                this.startRecording();
              }}
              label="Start Recording"
            />
          </StartStopHolder>
        )}
      </React.Fragment>
    );
  }
}
export default WhiteBoard;
