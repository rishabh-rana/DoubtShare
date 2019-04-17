import { firestore } from "../../config/firebase";
import { storage } from "../../config/firebase";

export const answerQuestion = (obj, docid, finishLoading) => {
  return async dispatch => {
    if (obj.file) {
      const name = Date.now() + obj.uid;
      let blob = await fetch(obj.file).then(r => r.blob());
      await storage.child("images/" + name).put(blob);
      const url = await storage.child("images/" + name).getDownloadURL();

      console.log(url);

      let ref = firestore
        .collection("questions")
        .doc(docid)
        .collection("answers")
        .doc();
      const ansid = ref.id;

      firestore
        .collection("questions")
        .doc(docid)
        .collection("answers")
        .doc(ansid)
        .set({
          description: obj.description,
          timestamp: Date.now(),
          file: url,
          type: obj.type,
          uploader: {
            uid: obj.uid,
            displayName: obj.displayName,
            [obj.uid]: Date.now()
          },
          upvotes: [],
          downvotes: []
        });

      console.log("ANSWERED");
      finishLoading();
    } else {
      let ref = firestore
        .collection("questions")
        .doc(docid)
        .collection("answers")
        .doc();
      const ansid = ref.id;

      firestore
        .collection("questions")
        .doc(docid)
        .collection("answers")
        .doc(ansid)
        .set({
          description: obj.description,
          timestamp: Date.now(),
          file: null,
          type: null,
          uploader: {
            uid: obj.uid,
            displayName: obj.displayName,
            [obj.uid]: Date.now()
          },
          upvotes: [],
          downvotes: []
        });
      finishLoading();
    }
  };
};
