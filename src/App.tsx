import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SalesTracker from './pages/SalesTracker';
import Index from './pages/Index';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sales-tracker" element={<SalesTracker />} />
      </Routes>
    </Router>
  );
}

export default App;