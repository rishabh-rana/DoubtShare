import { firestore } from "../../config/firebase";

export const flushFeed = () => {
  return dispatch => {
    dispatch({ type: "getNewFeed", payload: [] });
  };
};

export const getFeed = (filter, paginate) => {
  return async dispatch => {
    try {
      let newFeed = false;
      const feed = [];
      let query = firestore.collection("questions");
      if (filter) {
        query = query.where(filter, ">", 0);

        query = query.orderBy(filter, "desc");
      } else {
        query = query.orderBy("timestamp", "desc");
      }

      if (
        paginate &&
        paginate.filter === filter &&
        paginate.feedDone !== true
      ) {
        query = query.startAfter(paginate.lastDoc);
      } else if (paginate && paginate.filter !== filter) {
        newFeed = true;
      } else {
        newFeed = true;
      }

      if ((paginate && paginate.feedDone !== true) || !paginate) {
        const snap = await query.limit(4).get();

        var lastDoc = snap.docs[snap.docs.length - 1];
        if (lastDoc) {
          dispatch({ type: "paginateDoc", payload: { lastDoc, filter } });
        } else {
          dispatch({ type: "paginateDoc", payload: { feedDone: true } });
        }

        snap.forEach(doc => {
          feed.push({
            ...doc.data(),
            docid: doc.id
          });
        });

        if (feed.length === 0)
          dispatch({
            type: "throwerror",
            payload: { message: "The feed is over" }
          });

        if (newFeed) {
          dispatch({ type: "getNewFeed", payload: feed });
        } else {
          dispatch({ type: "getContinuedFeed", payload: feed });
        }
      } else {
        dispatch({
          type: "throwerror",
          payload: { message: "The feed is over" }
        });
        console.log("feed over");
      }
    } catch (error) {
      dispatch({
        type: "throwerror",
        payload: {
          message: "Cannot retrieve feed. Please check your internet connection"
        }
      });
    }
  };
};

export const reask = (reasks, docid) => {
  return dispatch => {
    try {
      firestore
        .collection("questions")
        .doc(docid)
        .update({
          reAsks: reasks
        });
    } catch (error) {
      dispatch({
        type: "throwerror",
        payload: {
          message:
            "Cannot reAsk question. Please check your internet connection"
        }
      });
    }
  };
};

export const bookmarkques = (bookmarks, docid) => {
  return dispatch => {
    try {
      firestore
        .collection("questions")
        .doc(docid)
        .update({
          bookmarks
        });
    } catch (error) {
      dispatch({
        type: "throwerror",
        payload: {
          message:
            "Cannot bookmark question. Please check your internet connection"
        }
      });
    }
  };
};

export const upvote = (quesId, ansId, upvotearray, downvoteArray) => {
  return dispatch => {
    try {
      firestore
        .collection("questions")
        .doc(quesId)
        .collection("answers")
        .doc(ansId)
        .update({
          upvotes: upvotearray,
          downvotes: downvoteArray
        });
    } catch (error) {
      dispatch({
        type: "throwerror",
        payload: {
          message:
            "Cannot upvote question. Please check your internet connection"
        }
      });
    }
  };
};

export const setFilter = tag => {
  return dispatch => {
    dispatch({ type: "setFilter", payload: tag });
  };
};
