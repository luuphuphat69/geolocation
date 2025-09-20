import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Search from './pages/search';
import Result from './pages/result2';
import WeatherDetails from './pages/details2';
import firebaseApp from './firebaseapp';
import { getMessaging } from 'firebase/messaging';
import {getFCMToken} from './messagingManageToken';


function requestLocation() {
  if (navigator.geolocation) {
    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
      if (permissionStatus.state === 'denied') {
        alert('Please allow location access in your browser settings.');
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
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

  const messaging = getMessaging(firebaseApp);

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
        <Route path='/details' element={<WeatherDetails />} />
      </Routes>
    </Router>
  );
}

export default App;