import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Search from './pages/search';
import Result from './pages/result';
import CityWeatherDetails from './pages/details';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/search" />} />
          <Route path="/search" element={<Search />} />
          <Route path="/result" element={<Result/>} />
          <Route path='/details' element={<CityWeatherDetails/>} />
        </Routes>
    </Router>
  )
}
export default App