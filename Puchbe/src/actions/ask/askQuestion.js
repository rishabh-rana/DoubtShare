import { firestore } from "../../config/firebase";
import { storage } from "../../config/firebase";
import firebase from "firebase/app";

export const askQuestion = obj => {
  return async dispatch => {
    try {
      const name = Date.now() + ".jpg";
      let blob = await fetch(obj.image).then(r => r.blob());
      await storage.child("questions/" + name).put(blob);
      const url = await storage.child("questions/" + name).getDownloadURL();

      console.log(url);

      let ref = firestore.collection("questions").doc();
      const docid = ref.id;

      firestore
        .collection("users")
        .doc(obj.uid)
        .update({
          points: firebase.firestore.FieldValue.increment(2)
        });

      firestore
        .collection("questions")
        .doc(docid)
        .set({
          title: obj.title,
          timestamp: Date.now(),
          image: url,
          deletePath: name,
          uploader: {
            uid: obj.uid,
            displayName: obj.displayName,
            [obj.uid]: Date.now()
          },
          reAsks: {},
          tags: obj.tags,
          bookmarks: {}
        });
      firestore
        .collection("users")
        .doc(obj.uid)
        .collection("questions")
        .doc(docid)
        .set({ exist: true });

      dispatch({ type: "uploaded" });
    } catch (error) {
      dispatch({
        type: "throwerror",
        payload: {
          message: "Cannot upload the question now. Please try again",
          color: "red"
        }
      });
    }
  };
};

export const uploaded = () => {
  return dispatch => {
    dispatch({ type: "uploaded" });
  };
};

export const uploading = () => {
  return dispatch => {
    dispatch({ type: "uploading" });
  };
};

export const deleteQuestion = (quesObj, quesId) => {
  return async dispatch => {
    try {
      const answers = await firestore
        .collection("questions")
        .doc(quesId)
        .collection("answers")
        .get();

      answers.forEach(ans => {
        firestore
          .collection("questions")
          .doc(quesId)
          .collection("answers")
          .doc(ans.id)
          .delete();

        storage.child("answers/" + ans.data().deletePath).delete();

        console.log(ans.data().deletePath);
      });

      storage.child("questions/" + quesObj.deletePath).delete();
      firestore
        .collection("questions")
        .doc(quesId)
        .delete();
    } catch (error) {
      dispatch({
        type: "throwerror",
        payload: {
          message: "Cannot delete the question now. Please try again",
          color: "red"
        }
      });
    }
  };
};
