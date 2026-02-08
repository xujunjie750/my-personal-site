import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import siteData from '../data/siteData.json';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchItems = [];

    // Search Page Names
    if ("研究报告".includes(query) || "research".includes(query.toLowerCase())) {
      searchItems.push({ type: '页面', title: '研究报告专题', path: '/research', id: 'page-res' });
    }
    if ("作品集".includes(query) || "projects".includes(query.toLowerCase())) {
      searchItems.push({ type: '页面', title: '个人作品集', path: '/projects', id: 'page-prj' });
    }
    if ("关于我".includes(query) || "about".includes(query.toLowerCase())) {
      searchItems.push({ type: '页面', title: '关于我的经历', path: '/about', id: 'page-abt' });
    }

    // Search Projects
    siteData.detailedProjects.forEach(p => {
      if (p.name.toLowerCase().includes(query.toLowerCase()) || 
          p.description.toLowerCase().includes(query.toLowerCase())) {
        searchItems.push({ type: '作品', title: p.name, path: '/projects', id: p.id });
      }
    });

    // Search Research
    siteData.research.reports.forEach(r => {
      if (r.title.toLowerCase().includes(query.toLowerCase()) || 
          r.summary.toLowerCase().includes(query.toLowerCase())) {
        searchItems.push({ type: '研究', title: r.title, path: '/research', id: r.id });
      }
    });

    // Search Career Stages
    siteData.careerTimeline.forEach(t => {
      if (t.stage.toLowerCase().includes(query.toLowerCase()) || 
          t.desc.toLowerCase().includes(query.toLowerCase())) {
        searchItems.push({ type: '关于', title: t.stage, path: '/about', id: t.stage });
      }
    });

    setResults(searchItems.slice(0, 5));
  }, [query]);

  const handleSelect = (path) => {
    onClose();
    // Use a small timeout to ensure modal closes before navigation starts
    setTimeout(() => {
      navigate(path);
      window.scrollTo(0, 0);
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[0].path);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-pure-black/90 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="w-full max-w-2xl bg-pure-white p-8 rounded-sm shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative flex items-center mb-8 pb-4 border-b border-pure-black/5">
              <SearchIcon className="text-pure-black/60 mr-4" size={24} />
              <input
                ref={inputRef}
                type="text"
                placeholder="在此输入搜索关键词..."
                className="w-full bg-transparent border-none focus:ring-0 text-2xl font-light text-pure-black placeholder:text-pure-black/20 caret-pure-black outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={onClose} className="text-pure-black/40 hover:text-pure-black transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {results.length > 0 ? (
                results.map((res, idx) => (
                  <button
                    key={`${res.id}-${idx}`}
                    onClick={() => handleSelect(res.path)}
                    className="w-full flex items-center justify-between p-4 hover:bg-light-grey transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-pure-black text-pure-white">
                        {res.type}
                      </span>
                      <span className="text-lg font-bold text-pure-black group-hover:translate-x-1 transition-transform">{res.title}</span>
                    </div>
                    <ArrowRight className="text-pure-black opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" size={18} />
                  </button>
                ))
              ) : query.length > 1 ? (
                <p className="text-center py-8 text-pure-black/40 font-light italic">未找到匹配项</p>
              ) : (
                <p className="text-center py-8 text-pure-black/20 font-light italic">输入至少两个字符开始搜索</p>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-pure-black/5 flex justify-between text-[10px] font-bold uppercase tracking-widest text-pure-black/30">
              <span>Esc 关闭</span>
              <span>Enter 选择</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
