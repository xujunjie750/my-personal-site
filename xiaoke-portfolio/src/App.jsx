import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. 导入导航栏 - 这是最关键的一行，确保路径和文件名完全正确
import Navbar from './components/NewNavbar'; // 您新建的、可用的导航栏文件
import ScrollToTop from './components/ScrollToTop';

// 2. 导入页面组件
import Home from './components/Home';
import AboutPage from './components/AboutPage';
import Research from './components/Research';
import ProjectsPage from './components/ProjectsPage';
import Contact from './components/Contact';

// 3. 主应用组件
function App() {
  return (
    // Router 组件包裹整个应用，以支持页面跳转
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        {/* 使用新的导航栏 */}
        <Navbar />
        <main className="pt-16"> {/* 为固定导航栏预留顶部空间 */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/research" element={<Research />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/contact" element={<Contact />} />
            {/* 如果还有其他页面，可以在这里添加 Route */}
          </Routes>
        </main>
        {/* 如果您的 Contact 组件设计为页脚，可以在这里启用 */}
        {/* <Contact /> */}
      </div>
    </Router>
  );
}

export default App;