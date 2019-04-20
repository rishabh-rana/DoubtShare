importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "468440082009"
});
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  var notificationTitle = "Hello world";
  var notificationOptions = {
    body: "Background Message body.",
    icon: "/logo.png"
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
