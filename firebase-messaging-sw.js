
'use strict';
 
importScripts("https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.4/firebase-messaging.js");
 
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDHfCOlxqcCBNwJ0FD4uHljXotLPNeaDLE",
  authDomain: "push-notification-51f57.firebaseapp.com",
  projectId: "push-notification-51f57",
  storageBucket: "push-notification-51f57.appspot.com",
  messagingSenderId: "219899714622",
  appId: "1:219899714622:web:7070073db263d1294a856f",
  measurementId: "G-P6JCVHM9L9"
};
 
// Initialize the firebase in the service worker.
firebase.initializeApp(FIREBASE_CONFIG);
 
self.addEventListener('push', function (event) {
	var data = event.data.json();
 
	const title = data.Title;
	data.Data.actions = data.Actions;
	const options = {
		body: data.Message,
		data: data.Data
	};
	event.waitUntil(self.registration.showNotification(title, options));
});
 
self.addEventListener('notificationclick', function (event) {});
 
self.addEventListener('notificationclose', function (event) {});
