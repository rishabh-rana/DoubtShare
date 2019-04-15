import React from "react";
import WhiteBoard from "./whiteboard";
import Loader from "../ui/loader/loader";
import FinalScreen from "./finalScreen";
import CropUI from "../ask/cropper";

class AnswerBox extends React.Component {
  state = {
    image: [],
    whiteBoardFile: null,
    submittingAnswer: false,
    display: "cropUI",
    additionalImage: null
  };
  render() {
    switch (this.state.display) {
      case "cropUI":
        return (
          <CropUI
            image={
              this.state.additionalImage === null
                ? this.props.answerImage
                : this.state.additionalImage
            }
            setImage={image =>
              this.setState({ image: [...this.state.image, image] })
            }
            cropDone={() => this.setState({ display: "whiteboard" })}
          />
        );

      case "whiteboard":
        return (
          <WhiteBoard
            image={this.state.image}
            setFile={file =>
              this.setState({ whiteBoardFile: file, display: "final" })
            }
            addNewImage={img =>
              this.setState({
                display: "cropUI",
                additionalImage: img
              })
            }
          />
        );

      case "final":
        return (
          <FinalScreen
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
