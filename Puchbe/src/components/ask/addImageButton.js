import React from "react";
import Button from "../ui/button";

const ImageButton = props => {
  return (
    <div style={{ position: "relative" }}>
      <input
        style={{
          width: "100%",
          opacity: 0,
          position: "absolute",
          display: "block",
          height: "40px"
        }}
        type="file"
        multiple={false}
        accept="image/*"
        capture="camera"
        onChange={e => {
          props.setImage(URL.createObjectURL(e.target.files[0]));
          if (props.onChangeHandler) props.onChangeHandler();
        }}
      />
      <Button
        label={props.label ? props.label : "Add Image"}
        color={props.color || "primary"}
      />
    </div>
  );
};

export default ImageButton;
