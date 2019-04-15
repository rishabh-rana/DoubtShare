import { firestore } from "../../config/firebase";

export const checkUpdates = () => {
  return async dispatch => {
    const version = await firestore
      .collection("version")
      .doc("version")
      .get();

    const currentV = localStorage.getItem("version");

    if (currentV && currentV !== version.data().version) {
      localStorage.setItem("version", version.data().version);
      window.location.reload(true);
    } else if (currentV === null || currentV === "null") {
      localStorage.setItem("version", version.data().version);
    }
  };
};
