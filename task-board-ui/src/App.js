import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail'; 

// 1. DELETE the line: const ProjectDetail = () => ... (It was overriding your import)

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* 2. Add the Dashboard route so your home page works */}
          <Route path="/" element={<Dashboard />} />
          
          {/* 3. This will now use the component imported from './pages/ProjectDetail' */}
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;