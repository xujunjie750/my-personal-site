import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import SearchModal from './SearchModal';

const NewNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  // 处理滚动效果
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 处理 Ctrl+K / Cmd+K 快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 您的导航菜单
  const navLinks = [
    { name: '首页', path: '/' },
    { name: '作品', path: '/projects' },
    { name: '研究', path: '/research' },
    { name: '关于', path: '/about' },
    { name: '联系', path: '/contact' },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white'}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 左侧 Logo */}
            <Link to="/" className="text-xl font-bold text-gray-900 no-underline">
              XU JUNJIE
            </Link>

            {/* 中央导航链接 (桌面端) */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium no-underline transition-colors hover:text-blue-600 ${location.pathname === link.path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* 右侧搜索按钮 */}
            <button
              onClick={() => {
                console.log('搜索按钮被点击！'); // 在控制台确认点击
                setIsSearchOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium"
              aria-label="搜索"
            >
              <Search size={18} />
              <span>搜索</span>
              <kbd className="hidden lg:inline-block px-2 py-1 text-xs border rounded bg-white">⌘K</kbd>
            </button>
          </div>

          {/* 移动端导航链接 */}
          <div className="md:hidden mt-4 flex flex-wrap justify-center gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 text-sm rounded-full ${location.pathname === link.path ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* 搜索弹窗 */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default NewNavbar;