import * as functions from "firebase-functions";
import admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

function sendNotificationToDB(
  userId: string,
  notifTitle: string,
  description: string,
  data: any
) {
  console.log("saving noti to db");
  db.collection("users")
    .doc(userId)
    .collection("notifications")
    .add({
      title: notifTitle,
      description: description,
      questionId: data.questionId,
      timestamp: Date.now()
    });

  return true;
}

async function sendNotification(
  userId: string,
  notifTitle: string,
  description: string,
  data: any
) {
  console.log("Sending notification to " + userId);
  sendNotificationToDB(userId, notifTitle, description, data);
  let userDocument = db.collection("users").doc(userId);
  await userDocument
    .get()
    .then(async document => {
      if (document != null && document != undefined) {
        let gcm_token: string = document.get("gcm_token");
        if (
          gcm_token != null &&
          gcm_token != undefined &&
          gcm_token.length != 0
        ) {
          var message = {
            notification: {
              title: notifTitle,
              body: description
            },
            data: data,
            token: gcm_token
          };
          await admin
            .messaging()
            .send(message)
            .then((response: any) => {
              console.log("Send notification successfully: ", response);
              return new Promise((resolve, reject) => {
                resolve(true);
              });
            })
            .catch((err: any) => {
              console.log("Unable to send notification: ", err);
              return new Promise((resolve, reject) => {
                resolve(false);
              });
            });
        }
      }
      // return true;
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    })
    .catch(err => {
      console.error("Got error while sending notification: " + err);
      return new Promise((resolve, reject) => {
        resolve(false);
      });
      //        return false;
    });
}
exports.onChangeNotify = functions.firestore
  .document("/questions/{questionId}/answers/{answerId}")
  .onCreate(async (snap, context) => {
    console.log("Entered into function onChangeNotify");

    console.log(context.params.questionId);

    const doc = await db
      .collection("questions")
      .doc(context.params.questionId)
      .get();

    const data = doc.data();

    console.log(data);

    let receivers: any[] = [];
    if (data) {
      receivers = Object.keys(data.reAsks);
      if (receivers.indexOf(data.uploader.uid) === -1)
        receivers.push(data.uploader.uid);
    }

    const ansData = snap.data();

    let answerer: String = "Someone";
    if (ansData && ansData.uploader.displayName) {
      answerer = ansData.uploader.displayName;
    }

    receivers.forEach(async id => {
      const title = "Your question was just answered!";
      const description =
        answerer + " just answered your question. Tap to go to answer.";
      const data = { questionId: context.params.questionId };

      await sendNotification(id, title, description, data);
    });

    console.log("Exited from function onChangeNotify");
  });
