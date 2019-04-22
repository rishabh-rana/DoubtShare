import { firestore } from "../../config/firebase";
import { storage } from "../../config/firebase";

export const answerQuestion = (obj, docid, finishLoading) => {
  return async dispatch => {
    if (obj.file) {
      const name = Date.now() + obj.uid + ".webm";
      let blob = await fetch(obj.file).then(r => r.blob());
      await storage.child("answers/" + name).put(blob);
      const url = await storage.child("answers/" + name).getDownloadURL();

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
          deletePath: name,
          type: obj.type,
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

export const deleteAnswer = (ansObj, quesId, ansId) => {
  return dispatch => {
    firestore
      .collection("questions")
      .doc(quesId)
      .collection("answers")
      .doc(ansId)
      .delete();

    storage.child("answers/" + ansObj.deletePath).delete();
  };
};
