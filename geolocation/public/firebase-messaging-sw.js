// Import Firebase Messaging from CDN (workaround for service worker limitations)
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATcsVW3yFiRODjWlLaZJVQKSHRHwG2Sa8",
  authDomain: "geolocation-72da3.firebaseapp.com",
  projectId: "geolocation-72da3",
  storageBucket: "geolocation-72da3.firebasestorage.app",
  messagingSenderId: "593545686942",
  appId: "1:593545686942:web:9b01c38c7cb239df63308f",
  measurementId: "G-B7VQ02F6D0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});