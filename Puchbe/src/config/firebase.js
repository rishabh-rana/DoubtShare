import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import "firebase/auth";
import "firebase/messaging";

// production
import { FirebaseConfig } from "./keys.js";

firebase.initializeApp(FirebaseConfig);

const firestore = firebase.firestore();

firestore.enablePersistence();

const storage = firebase.storage().ref();
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
const per = firebase.auth.Auth.Persistence.LOCAL;

const messaging = firebase.messaging();

messaging.usePublicVapidKey(
  "BL2czrANR1YoQMySkZdglJeZpfYi0E-qUAETgLsVjcW0MTmscK1EtllUnPafZsI6rJZcqKvEWnk_EOvLcPGbaaM"
);

export { firestore, storage, provider, auth, per, messaging };
