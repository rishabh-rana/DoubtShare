import React from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import styled from "styled-components";
import colorParser from "../ui/color/colorParser";
import Button from "../ui/button";

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

const PositionButtons = styled.div`
  position: fixed;
  bottom: 60px;
  left: 5px;
  right: 5px;
  display: flex;
  justify-content: space-around;
`;

class CropUI extends React.Component {
  handleRotate = () => {
    this.refs.cropper.rotate(90);
  };

  handleDone = () => {
    let a = Date.now();
    console.log("Start", Date.now() - a);
    let img = this.refs.cropper.getCroppedCanvas().toDataURL();
    console.log("got URL", Date.now() - a);
    if (this.props.answerMode) {
      let { width, height } = this.refs.cropper.getData();
      console.log("got aspect data", Date.now() - a);
      this.props.setAspect(height / width);
      console.log("setState on aspect", Date.now() - a);
    }
    this.props.setImage(img);
    console.log("setState on image", Date.now() - a);
    this.props.cropDone();
    console.log("setSTate on migration", Date.now() - a);
  };

  render() {
    return (
      <React.Fragment>
        <Cropper
          ref="cropper"
          src={this.props.image}
          viewMode={2}
          movable={false}
          rotatable={true}
          scalable={true}
          zoomable={true}
          style={{ height: window.innerHeight, width: "100%" }}
        />

        <PositionButtons>
          <Button
            label={<i class="fas fa-sync-alt" />}
            width="45%"
            color="secondary"
            onClick={this.handleRotate}
          />
          <Button
            label={<i className="fas fa-check" />}
            width="45%"
            color="green"
            onClick={this.handleDone}
          />
        </PositionButtons>
      </React.Fragment>
    );
  }
}
export default CropUI;
