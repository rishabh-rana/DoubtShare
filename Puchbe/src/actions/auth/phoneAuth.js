import mixpanel from "../../config/mixpanel";
import { firestore } from "../../config/firebase";

import { admins } from "../../admins";
import firebase from "firebase/app";

export const startsigninPhone = phone => {
  return dispatch => {
    const promise = new Promise((resolve, reject) => {
      const formattedphone = "+91" + phone;
      firebase
        .auth()
        .signInWithPhoneNumber(formattedphone, window.recaptchaVerifier)
        .then(function(confirmationResult) {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          console.log(window.confirmationResult);
          resolve(true);
        })
        .catch(function(error) {
          // Error; SMS not sent
          // ...
          console.log("rejected", error);
          resolve(false);
        });
    });
    return promise;
  };
};

export const completeSignin = result => {
  return async dispatch => {
    console.log(result);

    if (!result.additionalUserInfo.isNewUser) {
      // old user
      mixpanel.identify(result.user.uid);
      mixpanel.track("Signed In");
      firestore
        .collection("users")
        .doc(result.user.uid)
        .update({
          lastSignin: Date.now()
        });
      console.log(result.user);
      dispatch({ type: "syncusers", payload: result.user });
    } else {
      // fresh signup
      let isadmin = false;
      if (admins.indexOf(result.user.uid) !== -1) {
        isadmin = true;
      }
      mixpanel.alias(result.user.uid);
      mixpanel.people.set({
        $creationtime: result.user.metadata.creationTime,
        $isAdmin: isadmin,
        $name: result.name,
        $phoneNumber: result.user.phoneNumber
      });
      mixpanel.track("Signed In");
      firestore
        .collection("users")
        .doc(result.user.uid)
        .set({
          phone: result.user.phoneNumber,
          lastSignin: Date.now(),
          signedUpon: Date.now(),
          displayName: result.name,
          followers: {},
          followed: {},
          points: 0
        });
      dispatch({
        type: "syncusers",
        payload: { ...result.user, displayName: result.name }
      });
    }
  };
};
