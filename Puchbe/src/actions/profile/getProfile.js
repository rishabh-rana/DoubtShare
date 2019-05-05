import { firestore } from "../../config/firebase";

export const getUserData = (uid, myProfile) => {
  return dispatch => {
    dispatch({ type: "syncOtherUserData", payload: null });

    const promise1 = new Promise(async (resolve, reject) => {
      const doc = await firestore
        .collection("users")
        .doc(uid)
        .get();

      dispatch({
        type: myProfile ? "syncUserData" : "syncOtherUserData",
        payload: doc.data()
      });

      resolve(true);
    });

    return promise1;
  };
};
