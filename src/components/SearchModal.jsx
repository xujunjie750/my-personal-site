import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Search, FileText, LayoutGrid } from 'lucide-react';

// 导入数据
import researchData from '../data/researchData.js';
import siteData from '../data/siteData.json';

const SearchModal = ({ onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // 实时搜索逻辑
  useEffect(() => {
    if (!inputValue.trim()) {
      setResults([]);
      return;
    }
    const keyword = inputValue.toLowerCase().trim();
    const matched = [];

    // 1. 搜索研究课题
    researchData.forEach(item => {
      const matchInTitle = item.title.toLowerCase().includes(keyword);
      const matchInTags = item.tags?.some(tag => tag.toLowerCase().includes(keyword));
      const matchInAbstract = item.abstract.toLowerCase().includes(keyword);
      if (matchInTitle || matchInTags || matchInAbstract) {
        matched.push({
          type: '研究课题',
          icon: <FileText size={16} />,
          title: item.title,
          description: `类型：${item.type === 'provincial' ? '省部级' : '横向'} · 标签：${item.tags?.join(', ')}`,
          path: `/research?selected=${item.id}`,
          item: item
        });
      }
    });

    // 2. 搜索作品集项目
    siteData.detailedProjects.forEach(item => {
      const matchInName = item.name.toLowerCase().includes(keyword);
      const matchInTags = item.tags?.some(tag => tag.toLowerCase().includes(keyword));
      const matchInDesc = item.description.toLowerCase().includes(keyword);
      if (matchInName || matchInTags || matchInDesc) {
        matched.push({
          type: '作品集项目',
          icon: <LayoutGrid size={16} />,
          title: item.name,
          description: `分类：${item.category} · 标签：${item.tags?.join(', ')}`,
          path: `/projects?selected=${item.id}`,
          item: item
        });
      }
    });

    setResults(matched);
  }, [inputValue]);


  const handleResultClick = () => {
    onClose();
    setInputValue('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/50" onClick={onClose}>
      <div className="relative w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center p-4 border-b">
            <Search className="text-gray-400 mr-3 flex-shrink-0" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="搜索研究课题、关键词、标签..."
              className="flex-1 outline-none text-lg placeholder-gray-400 bg-transparent"
            />
            <button
              onClick={onClose}
              className="ml-3 p-1 hover:bg-gray-100 rounded flex-shrink-0"
              aria-label="关闭"
            >
              <X size={20} />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {inputValue && results.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">未找到与 “<span className="font-semibold">{inputValue}</span>” 相关的内容。</p>
                <p className="text-sm text-gray-400 mt-2">请尝试其他关键词。</p>
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                <p className="text-xs text-gray-500 px-4 py-2">找到 {results.length} 个相关结果</p>
                {results.map((result, index) => (
                  <Link
                    key={`${result.type}-${index}`}
                    to={result.path}
                    onClick={handleResultClick}
                    className="flex items-start p-4 hover:bg-gray-50 border-b last:border-b-0 group transition-colors"
                  >
                    <div className="mt-0.5 mr-3 text-gray-400 group-hover:text-blue-500">{result.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600">{result.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{result.description}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded mr-2">{result.type}</span>
                        {result.item?.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs text-gray-500 mr-2">#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-gray-300 group-hover:text-blue-400 ml-2">→</div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                  <Search className="text-gray-400" size={24} />
                </div>
                <p className="text-gray-600">输入关键词，实时搜索研究课题。</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {['人工智能', '省部级', '数字化转型', '产业规划'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setInputValue(tag)}
                      className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;