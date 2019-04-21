"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();
function sendNotificationToDB(userId, notifTitle, description, data) {
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
function sendNotification(userId, notifTitle, description, data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Sending notification to " + userId);
        sendNotificationToDB(userId, notifTitle, description, data);
        let userDocument = db.collection("users").doc(userId);
        yield userDocument
            .get()
            .then((document) => __awaiter(this, void 0, void 0, function* () {
            if (document != null && document != undefined) {
                let gcm_token = document.get("gcm_token");
                if (gcm_token != null &&
                    gcm_token != undefined &&
                    gcm_token.length != 0) {
                    var message = {
                        notification: {
                            title: notifTitle,
                            body: description
                        },
                        webpush: {
                            notification: {
                                body: description,
                                badge: "/logo.png"
                            }
                        },
                        data: data,
                        token: gcm_token
                    };
                    yield admin
                        .messaging()
                        .send(message)
                        .then((response) => {
                        return new Promise((resolve, reject) => {
                            resolve(true);
                        });
                    })
                        .catch((err) => {
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
        }))
            .catch(err => {
            return new Promise((resolve, reject) => {
                resolve(false);
            });
            //        return false;
        });
    });
}
exports.onChangeNotify = functions.firestore
    .document("/questions/{questionId}/answers/{answerId}")
    .onCreate((snap, context) => __awaiter(this, void 0, void 0, function* () {
    const doc = yield db
        .collection("questions")
        .doc(context.params.questionId)
        .get();
    const data = doc.data();
    let receivers = [];
    if (data) {
        receivers = Object.keys(data.reAsks);
        if (receivers.indexOf(data.uploader.uid) === -1)
            receivers.push(data.uploader.uid);
    }
    let topic = "a topic";
    if (data && data.tags) {
        topic = Object.keys(data.tags)[0];
    }
    const ansData = snap.data();
    let answerer = "Someone";
    if (ansData && ansData.uploader.displayName) {
        answerer = ansData.uploader.displayName;
    }
    receivers.forEach((id) => __awaiter(this, void 0, void 0, function* () {
        const title = "Your question was just answered!";
        const description = answerer + " just answered your question on " + topic + ".";
        const data = { questionId: context.params.questionId };
        yield sendNotification(id, title, description, data);
    }));
    console.log("Exited from function onChangeNotify");
}));
//# sourceMappingURL=index.js.map