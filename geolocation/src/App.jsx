import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Search from './pages/search';
import Result from './pages/result';
import CityWeatherDetails from './pages/details';
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import getFCMToken from './messaging_getToken';

const firebaseConfig = {
  apiKey: "AIzaSyATcsVW3yFiRODjWlLaZJVQKSHRHwG2Sa8",
  authDomain: "geolocation-72da3.firebaseapp.com",
  projectId: "geolocation-72da3",
  storageBucket: "geolocation-72da3.firebasestorage.app",
  messagingSenderId: "593545686942",
  appId: "1:593545686942:web:9b01c38c7cb239df63308f",
  measurementId: "G-B7VQ02F6D0",
};

function requestLocation() {
  if (navigator.geolocation) {
    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
      if (permissionStatus.state === 'denied') {
        alert('Please allow location access in your browser settings.');
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Latitude:", latitude, "Longitude:", longitude);
          },
          (err) => {
            console.error("Error getting location:", err.message);
            alert("Unable to retrieve location.");
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
    });
  } else {
    alert('Geolocation is not supported in your browser.');
  }
}
function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission()
    .then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Unable to get permission to notify.');
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
function App() {
  requestLocation();
  requestPermission();

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  getFCMToken(messaging);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });

  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/search" />} />
        <Route path="/search" element={<Search />} />
        <Route path="/result" element={<Result />} />
        <Route path='/details' element={<CityWeatherDetails />} />
      </Routes>
    </Router>
  );
}

export default App;