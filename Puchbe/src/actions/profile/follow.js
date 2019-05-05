import { firestore } from "../../config/firebase";
import firebase from "firebase/app";

export const followUser = (myUid, uidTobeAdded, myName, nameTobeAdded) => {
  return dispatch => {
    firestore
      .collection("users")
      .doc(myUid)
      .update({
        ["followed." + uidTobeAdded]: nameTobeAdded
      });

    firestore
      .collection("users")
      .doc(uidTobeAdded)
      .update({
        ["followers." + myUid]: myName
      });
    // var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
    // var theUrl = "https://google.com";
    // xmlhttp.open("POST", theUrl);
    // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // xmlhttp.send(
    //   JSON.stringify({
    //     uidTobeAdded: myUid,
    //     follwedUid: uidTobeAdded,
    //     nameTobeAdded: myName
    //   })
    // );
  };
};

export const unfollowUser = (myUid, uidTobeAdded) => {
  return dispatch => {
    firestore
      .collection("users")
      .doc(myUid)
      .update({
        ["followed." + uidTobeAdded]: firebase.firestore.FieldValue.delete()
      });

    firestore
      .collection("users")
      .doc(uidTobeAdded)
      .update({
        ["followers." + myUid]: firebase.firestore.FieldValue.delete()
      });
    // var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
    // var theUrl = "https://google.com";
    // xmlhttp.open("POST", theUrl);
    // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // xmlhttp.send(
    //   JSON.stringify({
    //     uidTobeAdded: myUid,
    //     follwedUid: uidTobeAdded,
    //     nameTobeAdded: myName
    //   })
    // );
  };
};
