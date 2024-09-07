import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Search from './pages/search';
import Result from './pages/result';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/search" />} />
          <Route path="/search" element={<Search />} />
          <Route path="/result" element={<Result/>} />
        </Routes>
    </Router>
  )
}
export default App