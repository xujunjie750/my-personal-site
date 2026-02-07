import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/NewNavbar';
import Home from './components/Home';
import AboutPage from './components/AboutPage';
import Research from './components/Research';
import ProjectsPage from './components/ProjectsPage'; // 统一使用这个
import Contact from './components/Contact';
import ProjectDetail from './components/ProjectDetail';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white text-black">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/research" element={<Research />} />
            <Route path="/projects" element={<ProjectsPage />} /> 
            <Route path="/contact" element={<Contact />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;