import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyATcsVW3yFiRODjWlLaZJVQKSHRHwG2Sa8",
    authDomain: "geolocation-72da3.firebaseapp.com",
    projectId: "geolocation-72da3",
    storageBucket: "geolocation-72da3.firebasestorage.app",
    messagingSenderId: "593545686942",
    appId: "1:593545686942:web:9b01c38c7cb239df63308f",
    measurementId: "G-B7VQ02F6D0"
};
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;