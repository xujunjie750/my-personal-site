import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import researchData from '../data/researchData';
import { Tag, Lightbulb, Globe, ShieldCheck } from 'lucide-react';

const Research = () => {
  // 1. 状态管理
  const [filter, setFilter] = useState('all'); // 'all', 'provincial', 'horizontal'
  const [selectedId, setSelectedId] = useState(researchData[0]?.id);
  const [searchParams] = useSearchParams();
  const listRefs = useRef({});

  // 核心逻辑：从 URL 获取选中 ID 并同步状态与滚动
  useEffect(() => {
    const selectedParam = searchParams.get('selected');
    if (selectedParam) {
      const id = parseInt(selectedParam, 10);
      const item = researchData.find(i => i.id === id);
      if (item) {
        setFilter('all'); // 确保在“全部”分类下，以便能看到搜索到的项
        setSelectedId(id);
        
        // 延迟执行滚动，确保 DOM 已渲染且分类已重置
        setTimeout(() => {
          const element = listRefs.current[id];
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [searchParams]);

  // 2. 过滤数据逻辑
  const filteredData = researchData.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  // 3. 处理筛选切换
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    const newData = researchData.filter(item => {
      if (newFilter === 'all') return true;
      return item.type === newFilter;
    });
    if (newData.length > 0) {
      // 如果当前选中的项不在新分类中，则选中新分类的第一项
      if (!newData.some(i => i.id === selectedId)) {
        setSelectedId(newData[0].id);
      }
    }
  };

  // 4. 根据 ID 找到当前选中的数据对象
  const selectedItem = researchData.find(item => item.id === selectedId) || filteredData[0] || researchData[0];

  return (
    <div className="pt-20 h-screen bg-white flex flex-col">
      {/* 顶部筛选栏 */}
      <div className="flex-none border-b bg-gray-50/30 px-12 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-6">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Filter / 筛选项目</span>
          <div className="flex bg-gray-100 p-1 rounded-sm">
            <button 
              onClick={() => handleFilterChange('all')}
              className={`px-6 py-1.5 text-xs font-bold transition-all ${
                filter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              全部课题
            </button>
            <button 
              onClick={() => handleFilterChange('provincial')}
              className={`px-6 py-1.5 text-xs font-bold transition-all ${
                filter === 'provincial' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              省部级课题
            </button>
            <button 
              onClick={() => handleFilterChange('horizontal')}
              className={`px-6 py-1.5 text-xs font-bold transition-all ${
                filter === 'horizontal' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              横向课题
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-row flex-1 overflow-hidden">
        
        {/* 左侧详情面板 (2/5 宽度) */}
        <div className="w-2/5 p-12 overflow-y-auto border-r bg-white custom-scrollbar">
          {selectedItem ? (
            <div className="max-w-xl mx-auto">
              {/* 类型与标签 */}
              <div className="flex items-center gap-4 mb-6">
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${
                  selectedItem.type === 'provincial' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
                }`}>
                  {selectedItem.type === 'provincial' ? '省部级课题' : '横向课题'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags?.map(tag => (
                    <span key={tag} className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 标题 */}
              <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
                {selectedItem.title}
              </h1>

              {/* 摘要 */}
              <div className="mb-10">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em] mb-4">Abstract / 摘要</h4>
                <p className="text-lg text-gray-600 font-light leading-relaxed text-justify">
                  {selectedItem.abstract}
                </p>
              </div>

              {/* 核心发现 */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Lightbulb size={18} className="text-blue-500" />
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em]">Core Findings / 核心发现</h4>
                </div>
                <ul className="space-y-4">
                  {selectedItem.coreFindings?.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-sm border-l-2 border-gray-200">
                      <span className="text-blue-500 font-mono text-sm font-bold">0{idx + 1}</span>
                      <p className="text-gray-700 text-sm leading-relaxed">{finding}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 italic">
              请选择一个课题查看详情
            </div>
          )}
        </div>

        {/* 右侧可滚动列表 (3/5 宽度) */}
        <div className="w-3/5 overflow-y-auto bg-gray-50/50 p-8 custom-scrollbar">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="mb-8 flex items-center justify-between text-gray-400">
              <span className="text-[10px] font-bold uppercase tracking-widest">Archive / 课题档案库</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{filteredData.length} Projects</span>
            </div>

            {filteredData.map((item) => (
              <div 
                key={item.id}
                ref={el => listRefs.current[item.id] = el}
                onClick={() => setSelectedId(item.id)}
                className={`p-6 bg-white border cursor-pointer transition-all duration-200 ${
                  selectedId === item.id 
                  ? 'border-l-4 border-l-blue-500 bg-blue-50/30 shadow-sm ring-1 ring-blue-500/10' 
                  : 'hover:bg-gray-50 border-gray-100'
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter ${
                      item.type === 'provincial' ? 'text-blue-600 bg-blue-50' : 'text-green-600 bg-green-50'
                    }`}>
                      {item.type === 'provincial' ? '省部级' : '横向'}
                    </span>
                    <h3 className={`text-lg font-bold truncate ${selectedId === item.id ? 'text-blue-900' : 'text-gray-800'}`}>
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags?.map(tag => (
                      <span key={tag} className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}} />
    </div>
  );
};

export default Research;
