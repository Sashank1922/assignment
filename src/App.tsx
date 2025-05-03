// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Form from './pages/EmployeeForm'
import ViewEmployee from './pages/ViewEmployee';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/EmployeeForm" element={<Form />} />
        <Route path="/viewEmployee/:id" element={<ViewEmployee />} />
      </Routes>
    </Router>
  );
}

export default App;
