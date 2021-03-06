import React from "react";
import WhiteBoard from "../../whiteboard/whiteboard";
import FinalScreen from "./finalAnswerScreen";
import CropUI from "../../cropper/cropper";
import mixpanel from "../../../config/mixpanel";
import PointsPLusCard from "../../ui/plusPointsCard";

class AnswerBox extends React.Component {
  state = {
    image: [],
    whiteBoardFile: null,
    submittingAnswer: false,
    display: "cropUI",
    additionalImage: null,
    aspectRatio: null
  };

  handleRetake = () => {
    this.setState({
      image: [],
      whiteBoardFile: null,
      submittingAnswer: false,
      display: "cropUI",
      additionalImage: null,
      aspectRatio: null
    });
  };

  render() {
    switch (this.state.display) {
      case "cropUI":
        return (
          <React.Fragment>
            <CropUI
              answerMode={true}
              image={
                this.state.additionalImage === null
                  ? this.props.answerImage
                  : this.state.additionalImage
              }
              setImage={image =>
                this.setState({
                  image: [...this.state.image, image]
                })
              }
              setAspect={aspectRatio =>
                this.setState({ aspectRatio: aspectRatio })
              }
              cropDone={() => {
                mixpanel.track("croppingImageCompleted");
                this.setState({ display: "whiteboard" });
              }}
            />
          </React.Fragment>
        );

      case "whiteboard":
        return (
          <WhiteBoard
            image={this.state.image}
            aspectRatio={this.state.aspectRatio}
            setFile={file => {
              mixpanel.track("completed whiteboard recording");
              this.setState({ whiteBoardFile: file, display: "final" });
            }}
          />
        );

      case "final":
        return (
          <FinalScreen
            handleRetake={this.handleRetake}
            setImage={this.props.setImage}
            type="video"
            file={this.state.whiteBoardFile}
            images={this.state.image}
            docid={this.props.answeringDoc}
            loader={() => this.setState({ display: "loading" })}
            changeAnswerMode={this.props.changeAnswerMode}
          />
        );
      case "loading":
        return <PointsPLusCard points="5" />;
    }
  }
}
export default AnswerBox;
