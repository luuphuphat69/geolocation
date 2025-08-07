import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Search from './pages/search';
import Result from './pages/result2';
import WeatherDetails from './pages/details2';

function App() {
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