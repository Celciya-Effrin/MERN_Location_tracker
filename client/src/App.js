import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Map from './Project/map';
import DriverLog from './Project/driverLog';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/driverLog" element={<DriverLog />} />
      </Routes>
    </Router>
  );
}

export default App;
