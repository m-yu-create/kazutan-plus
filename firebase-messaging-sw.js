/* Kazutan+ Firebase Messaging Service Worker
   バックグラウンドでFCM通知を受信して表示する */

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAe44e1VKvd-NmlhD0JnJmqQwi9IlB7Rek",
  authDomain: "kazutan-plus.firebaseapp.com",
  databaseURL: "https://kazutan-plus-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kazutan-plus",
  storageBucket: "kazutan-plus.firebasestorage.app",
  messagingSenderId: "468532340608",
  appId: "1:468532340608:web:32c86b4343bfe165e80365"
});

const messaging = firebase.messaging();

// バックグラウンド通知のハンドラ
// 注意: 通知の二重表示を防ぐため、ここでは notification を組み立てない
// （Cloud Functions側でnotificationフィールドを送れば、SDKが自動的に表示してくれる）
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message:", payload);
  // 何もしない（onBackgroundMessageでshowNotificationを呼ぶと二重表示になる）
});

// 通知タップ時の挙動
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = new URL("/kazutan-plus/", self.location.origin).href;
  event.waitUntil(
    clients.matchAll({type: "window", includeUncontrolled: true}).then((clientList) => {
      // 既に開いてるタブがあればそこにフォーカス
      for (const client of clientList) {
        if (client.url.includes("kazutan-plus") && "focus" in client) {
          return client.focus();
        }
      }
      // なければ新規で開く
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
