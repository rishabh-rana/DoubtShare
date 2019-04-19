import React from "react";
import WhiteBoard from "./whiteboard";
import Loader from "../ui/loader/loader";
import FinalScreen from "./finalScreen";
import CropUI from "../ask/cropper";

import mixpanel from "../../config/mixpanel";

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
        return <Loader />;
    }
  }
}
export default AnswerBox;
