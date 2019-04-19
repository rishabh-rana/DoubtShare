import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/ask/askQuestion";
import * as throwerror from "../../actions/error/errorHandler";
import Loader from "../../components/ui/loader/loader";
import Tagging from "./tagging";
import ImageButton from "./addImageButton";
import Button from "../ui/button";
import styled from "styled-components";
import CropUI from "./cropper";

import { scaleImage } from "./resizeUpload";

const Holder = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const Description = styled.textarea`
  border: 1px solid rgba(200, 200, 200, 0.8);
  width: 97%;
  padding: 5px;
  border-radius: 5px;
  outline: none;
  font-size: 18px;
`;

const TaggingMessage = styled.div`
  margin-top: 30px;
  margin-bottom: 10px;
  font-size: 20px;
`;

const ImageFiller = styled.div`
  border: 2px dashed black;
  border-radius: 5px;
  background: grey;
  opacity: 0.2;
  text-align: center;
  font-size: 50px;
  height: 150px;
  width: 100%;
  margin-bottom: 20px;
  margin-top: 20px;
  padding-top: 100px;
`;

class AskQuestion extends React.Component {
  state = {
    title: "",
    image: null,
    tags: [],
    croppingDone: true,
    screen: "addImage"
  };

  setImage = image => {
    this.setState({
      image
    });
  };

  validateSubmission = () => {
    if (this.state.tags.length === 0) {
      this.props.throwerror({
        message: "Please add atleast one tag"
      });
      return false;
    }

    if (!this.state.image) {
      this.props.throwerror({
        message: "Please add an image"
      });
      return false;
    }

    return true;
  };

  syncTags = taglist => {
    this.setState({
      tags: taglist
    });
  };

  mapTags = () => {
    // pull tags from state
    let array = [...this.state.tags];
    // sort by alphabet
    array.sort(function(a, b) {
      var nameA = a.toLowerCase(),
        nameB = b.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    // map to be sent
    let map = {};

    // get tags individually
    for (var i in array) {
      map[array[i]] = Date.now();
    }
    // handle case with 2 tags
    if (array.length === 2) {
      map[array[0] + "$" + array[1]] = Date.now();
    }
    //  handle case with 3 tags
    if (array.length === 3) {
      map[array[0] + "$" + array[1]] = Date.now();
      map[array[1] + "$" + array[2]] = Date.now();
      map[array[0] + "$" + array[2]] = Date.now();
      map[array[0] + "$" + array[1] + "$" + array[2]] = Date.now();
    }
    return map;
  };

  handlesubmit = () => {
    if (!this.validateSubmission()) return;

    let stt = this.state;

    this.props.uploading();
    const img = scaleImage(stt.image);

    this.props.askQuestion({
      title: stt.title,
      image: img,
      type: stt.type,
      uid: this.props.uid,
      displayName: this.props.displayName,
      tags: this.mapTags()
    });
    this.setState({
      title: "",
      description: "",
      image: null,
      type: null,
      tags: []
    });
  };

  render() {
    let loaderSetup = <Loader />;
    if (this.props.loading === false) {
      loaderSetup = (
        <Button
          label="Ask"
          color="primary"
          onClick={this.handlesubmit}
          inverted
          marginTop="60px"
        />
      );
    }

    if (!this.state.croppingDone) {
      return (
        <CropUI
          image={this.state.image}
          setImage={this.setImage}
          cropDone={() => this.setState({ croppingDone: true })}
        />
      );
    }

    return (
      <div style={{ padding: "10px", paddingBottom: "60px" }}>
        {this.state.image && (
          <img
            src={this.state.image}
            style={{
              display: "block",
              width: "100%",
              margin: "0 auto",
              marginBottom: "20px"
            }}
            className="filterFocus"
          />
        )}

        {!this.state.image && (
          <ImageFiller>
            <i className="fas fa-camera" />
          </ImageFiller>
        )}

        <ImageButton
          color="secondary"
          label={this.state.image ? "Change Image" : "Add Image"}
          setImage={image => this.setState({ image, croppingDone: false })}
        />
        <Holder>
          <Description
            placeholder="Enter Question Description"
            value={this.state.title}
            onChange={e => this.setState({ title: e.target.value })}
          />
        </Holder>

        <TaggingMessage>Add upto 3 tags</TaggingMessage>

        <Tagging syncTags={this.syncTags} tags={this.state.tags} />

        {loaderSetup}
      </div>
    );
  }
}

const mapstate = state => {
  return {
    uid: state.auth.uid,
    displayName: state.auth.displayName,
    loading: state.ask.uploading
  };
};
export default connect(
  mapstate,
  {
    ...actions,
    ...throwerror
  }
)(AskQuestion);
