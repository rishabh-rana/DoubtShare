import { firestore } from "../../config/firebase";

export const getUserData = (uid, myProfile) => {
  return async dispatch => {
    dispatch({ type: "syncOtherUserData", payload: null });

    const doc = await firestore
      .collection("users")
      .doc(uid)
      .get();

    dispatch({
      type: myProfile ? "syncUserData" : "syncOtherUserData",
      payload: doc.data()
    });

    return true;
  };
};
