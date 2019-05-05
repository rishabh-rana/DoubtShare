import { firestore } from "../../config/firebase";

export const handleForegroundNotif = data => {
  return dispatch => {
    dispatch({
      type: "throwerror",
      payload: {
        message: data.notification.body,
        color: "dodgerblue",
        duration: 6000,
        onClick: {
          action: "goToAnswer",
          id: data.data.questionId
        }
      }
    });
  };
};

export const getNotifications = (uid, paginate) => {
  return async dispatch => {
    let newFeed = false;
    let notifs = [];
    let query = firestore
      .collection("users")
      .doc(uid)
      .collection("notifications")
      .orderBy("timestamp", "desc");

    if (paginate && paginate.lastDoc) {
      query = query.startAfter(paginate.lastDoc);
    } else {
      newFeed = true;
    }

    if (!paginate.feedDone) {
      const snap = await query.limit(4).get();
      let lastDoc = snap.docs[snap.docs.length - 1];

      if (lastDoc) {
        dispatch({
          type: "setPaginationToNotifications",
          payload: {
            lastDoc
          }
        });
      } else {
        dispatch({
          type: "setPaginationToNotifications",
          payload: {
            feedDone: true
          }
        });
      }

      if (snap.docs.length < 4)
        dispatch({
          type: "setPaginationToNotifications",
          payload: {
            feedDone: true
          }
        });

      snap.forEach(doc => {
        notifs.push({
          ...doc.data(),
          docid: doc.id
        });
      });

      if (newFeed) {
        dispatch({ type: "newNotificationFeed", payload: notifs });
      } else {
        dispatch({ type: "continueNotificationFeed", payload: notifs });
      }
    }
  };
};
