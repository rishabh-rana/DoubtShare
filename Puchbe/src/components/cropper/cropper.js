import React from "react";
import Cropper from "react-cropper";
import "./cropper.css";
import styled from "styled-components";
import colorParser from "../ui/color/colorParser";
import Button from "../ui/button";
import Loader from "../ui/loader/loader";
import ErrorBoundary from "../errorHandler/ErrorBoundary";

// const TickButton = styled.div`
//   border-radius: 50%;
//   font-size: 30px;
//   padding: 10px;
//   position: fixed;
//   bottom: 70px;
//   right: 20px;
//   text-align: center;
//   width:
//   background: ${colorParser("primary")};
// `;

const Overlay = styled.div`
  background: black;
  opacity: 0.8;
  color: white;
  font-size: 50px;
  padding: 20px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const PositionButtons = styled.div`
  position: fixed;
  bottom: 60px;
  left: 5px;
  right: 5px;
  display: flex;
  justify-content: space-around;
`;

class CropUI extends React.Component {
  state = {
    cropLoading: false
  };

  handleRotate = () => {
    this.refs.cropper.rotate(90);
  };

  handleDone = () => {
    this.setState({ cropLoading: true });

    setTimeout(() => {
      let img = this.refs.cropper.getCroppedCanvas().toDataURL();

      if (this.props.answerMode) {
        let { width, height } = this.refs.cropper.getData();

        this.props.setAspect(height / width);
      }
      this.props.setImage(img);
      console.log(Date.now());
      this.props.cropDone();
    }, 5);
  };

  render() {
    return (
      <React.Fragment>
        <ErrorBoundary>
          <div style={{ position: "relative", zIndex: -100 }}>
            <Loader marginTop="200px" />
          </div>
          <Cropper
            ref="cropper"
            src={this.props.image}
            viewMode={2}
            movable={false}
            rotatable={true}
            scalable={true}
            zoomable={true}
            autoCropArea={0.6}
            style={{ height: window.innerHeight, width: "100%" }}
          />

          {this.state.cropLoading && (
            <Overlay>
              <Loader className="overrideWhiteColor" />
              {this.props.cropUIMessage || "Preparing Whiteboard Experience"}
            </Overlay>
          )}

          {!this.state.cropLoading && (
            <PositionButtons>
              <Button
                label={<i class="fas fa-sync-alt" />}
                width="45%"
                color="secondary"
                onClick={this.handleRotate}
                mixpanelLabel="PressRotateCropperButton"
              />
              <Button
                label={<i className="fas fa-check" />}
                width="45%"
                color="green"
                onClick={this.handleDone}
                mixpanelLabel="pressDoneCropperButton"
              />
            </PositionButtons>
          )}
        </ErrorBoundary>
      </React.Fragment>
    );
  }
}
export default CropUI;
