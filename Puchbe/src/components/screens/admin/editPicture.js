import React from "react";
import { firestore, storage } from "../../../config/firebase";
import CropUI from "../../cropper/cropper";

class EditPicture extends React.Component {
  state = {
    data: null,
    image: null,
    processing: false
  };

  docid = null;

  async componentDidMount() {
    this.docid = this.props.location.pathname.split("/")[2];
    const doc = await firestore
      .collection("questions")
      .doc(this.docid)
      .get();

    if (!this.state.data)
      this.setState({
        data: doc.data()
      });
  }

  cropDone = async () => {
    storage.child("answers/" + this.state.data.deletePath).delete();
    const name = Date.now() + ".jpg";
    let blob = await fetch(this.state.image).then(r => r.blob());
    await storage.child("questions/" + name).put(blob);
    const url = await storage.child("questions/" + name).getDownloadURL();

    firestore
      .collection("questions")
      .doc(this.docid)
      .update({
        deletePath: name,
        image: url
      });

    this.props.history.push("/feed");
  };

  render() {
    if (!this.state.data) return <div>Loading...</div>;

    return (
      <React.Fragment>
        <CropUI
          image={this.state.data.image}
          cropUIMessage="Preparing Image"
          setImage={image => this.setState({ image })}
          cropDone={this.cropDone}
        />
      </React.Fragment>
    );
  }
}
export default EditPicture;
