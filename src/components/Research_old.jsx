import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// 修正路径：从上一级目录的data文件夹导入
import researchData from '../data/researchData.js';

function Research() {
  // 状态管理：当前选中ID，当前筛选类型
  const [selectedId, setSelectedId] = useState(researchData[0]?.id || null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'provincial', 'horizontal'

  // 核心修复：正确使用useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSelectedId = searchParams.get('selected');

  // 核心修复：如果URL中有ID，则用它作为初始选中项
  useEffect(() => {
    console.log('URL参数:', urlSelectedId);
    
    if (urlSelectedId && researchData.length > 0) {
      const idToSelect = parseInt(urlSelectedId, 10);
      // 检查ID是否有效且在数据中存在
      if (!isNaN(idToSelect) && researchData.some(item => item.id === idToSelect)) {
        console.log('从URL设置选中ID:', idToSelect);
        setSelectedId(idToSelect);
      } else {
        console.log('URL中的ID无效或不存在:', idToSelect);
      }
    }
  }, [urlSelectedId]);

  // 1. 根据筛选类型过滤数据
  const filteredData = useMemo(() => {
    if (filterType === 'all') return researchData;
    return researchData.filter(item => item.type === filterType);
  }, [filterType]);

  // 2. 根据选中的ID，从过滤后的数据中找到对应的详情
  const selectedItem = useMemo(() => {
    const item = filteredData.find(item => item.id === selectedId);
    return item || filteredData[0] || null;
  }, [selectedId, filteredData]);

  // 处理列表项点击 (修改：同时更新URL)
  const handleItemClick = (id) => {
    console.log('点击项目:', id);
    setSelectedId(id);
    // 核心新增：更新URL参数，使当前状态可被链接分享和刷新保留
    setSearchParams({ selected: id.toString() });
  };

  // 处理筛选按钮点击
  const handleFilterClick = (type) => {
    setFilterType(type);
    const newList = type === 'all' ? researchData : researchData.filter(item => item.type === type);
    if (newList.length > 0 && !newList.find(item => item.id === selectedId)) {
      const newId = newList[0].id;
      setSelectedId(newId);
      setSearchParams({ selected: newId.toString() }); // 筛选后也同步URL
    }
  };

  if (!researchData || researchData.length === 0) {
    return <div className="min-h-screen flex items-center justify-center p-8"><p className="text-gray-500">暂无数据。</p></div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 顶部筛选栏 */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">研究报告档案库</h1>
              <p className="text-gray-600 mt-1">专业、结构化地呈现所有研究成果</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['全部', '省部级课题', '横向课题'].map((label, idx) => {
                const typeMap = ['all', 'provincial', 'horizontal'];
                const typeKey = typeMap[idx];
                const isActive = filterType === typeKey;
                const count = typeKey === 'all' ? researchData.length : researchData.filter(item => item.type === typeKey).length;
                return (
                  <button
                    key={label}
                    onClick={() => handleFilterClick(typeKey)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isActive 
                      ? 'bg-gray-900 text-white shadow' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-gray-700' : 'bg-gray-300'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-3">
            当前展示 <span className="font-semibold">{filteredData.length}</span> 个研究课题
            {filterType !== 'all' && `（${filterType === 'provincial' ? '省部级' : '横向'}课题）`}
          </p>
        </div>
      </header>

      {/* 主体：左右分栏布局 */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* 左侧详情面板 */}
        <section className="lg:w-2/5 border-r border-gray-200 bg-white p-6 lg:p-8 overflow-y-auto">
          {selectedItem ? (
            <>
              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${selectedItem.type === 'provincial' 
                  ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                  : 'bg-green-50 text-green-800 border border-green-200'
                }`}>
                  {selectedItem.type === 'provincial' ? '🏛️ 省部级课题' : '🤝 横向课题'}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{selectedItem.title}</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedItem.tags?.map((tag, index) => (
                  <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    # {tag}
                  </span>
                ))}
              </div>
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">详细摘要</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedItem.abstract}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">核心发现</h3>
                <ul className="space-y-4">
                  {selectedItem.coreFindings?.map((finding, index) => (
                    <li key={index} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gray-800 text-white text-sm font-bold mr-4">
                        {index + 1}
                      </span>
                      <span className="text-gray-800 pt-0.5">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-12"><p className="text-gray-500">请从右侧列表中选择一个研究课题</p></div>
          )}
        </section>

        {/* 右侧可滚动列表 */}
        <section className="lg:w-3/5 flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 lg:hidden bg-gray-50">
            <h3 className="font-semibold text-gray-900">课题列表</h3>
            <p className="text-gray-600 text-sm mt-1">点击任一课题查看详细内容</p>
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-50 lg:bg-white">
            {filteredData.length === 0 ? (
              <div className="p-12 text-center"><p className="text-gray-500">没有匹配的课题。</p></div>
            ) : (
              <div className="p-4 lg:p-6 space-y-4">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${selectedId === item.id
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${item.type === 'provincial'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                          }`}>
                            {item.type === 'provincial' ? '省级课题' : '横向课题'}
                          </span>
                          {item.tags?.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">#{tag}</span>
                          ))}
                          {item.tags?.length > 3 && (
                            <span className="text-gray-400 text-xs">+{item.tags.length - 3}个标签</span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.abstract}</p>
                      </div>
                      <div className={`ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${selectedId === item.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Research;