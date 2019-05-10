import { auth } from "../../config/firebase";
import { provider } from "../../config/firebase";
import { per } from "../../config/firebase";

import mixpanel from "../../config/mixpanel";
import { firestore } from "../../config/firebase";

import { admins } from "../../admins";

export const signin = () => {
  return async dispatch => {
    await auth.setPersistence(per);
    var result = await auth.signInWithPopup(provider);

    let isadmin = false;
    if (admins.indexOf(result.user.uid) !== -1) {
      isadmin = true;
    }

    mixpanel.identify(result.user.uid);
    mixpanel.people.set({
      $email: result.user.email,
      $name: result.user.displayName,
      $creationtime: result.user.metadata.creationTime,
      $isAdmin: isadmin
    });
    mixpanel.track("Signed In");

    var isreg = await firestore
      .collection("users")
      .doc(result.user.uid)
      .get();

    if (isreg.data()) {
      console.log("signedin again");
      firestore
        .collection("users")
        .doc(result.user.uid)
        .update({
          lastSignin: Date.now()
        });
    } else {
      console.log("fresh signup");
      firestore
        .collection("users")
        .doc(result.user.uid)
        .set({
          name: result.user.displayName,
          email: result.user.email,
          lastSignin: Date.now(),
          signedUpon: Date.now(),
          followers: {},
          followed: {}
        });
    }

    dispatch({ type: "syncusers", payload: result.user });
  };
};

export const signout = () => {
  return dispatch => {
    mixpanel.track("signedOutOfApp");
    auth.signOut();
    dispatch({ type: "syncusers", payload: null });
  };
};

export const syncusers = () => {
  return dispatch => {
    auth.onAuthStateChanged(function(user) {
      // console.log(user);
      if (user) {
        let usersmall = {
          displayName: user.displayName,
          uid: user.uid
        };
        dispatch({ type: "syncusers", payload: usersmall });
      } else {
        dispatch({ type: "syncusers", payload: null });
      }
    });
  };
};

export const setPhoneNumber = num => {
  return dispatch => {
    dispatch({ type: "setPhoneNumber", payload: num });
  };
};
