import { firestore } from "../../config/firebase";
import { storage } from "../../config/firebase";

export const askQuestion = obj => {
  return async dispatch => {
    if (obj.image) {
      const name = Date.now() + ".jpg";
      let blob = await fetch(obj.image).then(r => r.blob());
      await storage.child("images/" + name).put(blob);
      const url = await storage.child("images/" + name).getDownloadURL();

      console.log(url);

      let ref = firestore.collection("questions").doc();
      const docid = ref.id;

      firestore
        .collection("questions")
        .doc(docid)
        .set({
          title: obj.title,
          description: obj.description,
          timestamp: Date.now(),
          image: url,
          uploader: {
            uid: obj.uid,
            displayName: obj.displayName,
            [obj.uid]: Date.now()
          },
          reAsks: [],
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
    } else {
      let ref = firestore.collection("questions").doc();
      const docid = ref.id;

      firestore
        .collection("questions")
        .doc(docid)
        .set({
          title: obj.title,
          description: obj.description,
          timestamp: Date.now(),
          image: null,
          uploader: {
            uid: obj.uid,
            displayName: obj.displayName
          },
          reAsks: [],
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
