import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Search from './features/search/pages/search';
import Result from './features/result/result2';
import WeatherDetails from './features/details/details2';
import firebaseApp from './firebaseapp';
import { getMessaging } from 'firebase/messaging';
import { getFCMToken } from './messagingManageToken';
import { requestLocation } from './utilities/browser/browser';

function App() {
  useEffect(() => {
    requestLocation();

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
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/search" />} />
        <Route path="/search" element={<Search />} />
        <Route path="/result" element={<Result />} />
        <Route path="/details" element={<WeatherDetails />} />
      </Routes>
    </Router>
  );
}

export default App;