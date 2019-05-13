import { firestore } from "../../config/firebase";

export const getUserData = (uid, myProfile) => {
  return dispatch => {
    dispatch({ type: "syncOtherUserData", payload: null });

    const promise1 = new Promise(async (resolve, reject) => {
      const doc = await firestore
        .collection("users")
        .doc(uid)
        .get();

      let data = doc.data();

      if (data && !data.points) data.points = 0;

      console.log(data);

      dispatch({
        type: myProfile ? "syncUserData" : "syncOtherUserData",
        payload: data
      });

      resolve(true);
    });

    return promise1;
  };
};
