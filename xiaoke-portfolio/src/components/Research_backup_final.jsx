import React, { useState, useMemo } from 'react';

// ✅ 关键：根据您的文件位置，只保留下面一行正确的导入语句
import researchData from '../data/researchData.js'; // 假设文件在 src/data/ 下

function Research() {
  // 状态管理
  const [selectedId, setSelectedId] = useState(1); // 默认选中第一个
  const [filterType, setFilterType] = useState('all'); // 'all', 'provincial', 'horizontal'

  // 1. 根据筛选类型过滤数据
  const filteredData = useMemo(() => {
    if (filterType === 'all') return researchData;
    return researchData.filter(item => item.type === filterType);
  }, [filterType]);

  // 2. 找到当前选中的项目详情
  const selectedItem = useMemo(() => {
    return filteredData.find(item => item.id === selectedId) || filteredData[0] || null;
  }, [selectedId, filteredData]);

  // 处理列表项点击
  const handleItemClick = (id) => {
    setSelectedId(id);
  };

  // 处理筛选按钮点击
  const handleFilterClick = (type) => {
    setFilterType(type);
    // 筛选后，自动选中新列表中的第一项（如果存在）
    const newList = type === 'all' ? researchData : researchData.filter(item => item.type === type);
    if (newList.length > 0) {
      // 如果当前选中的不在新列表里，就选中新列表的第一个
      if (!newList.find(item => item.id === selectedId)) {
        setSelectedId(newList[0].id);
      }
    }
  };

  // 如果数据为空，显示提示
  if (!researchData || researchData.length === 0) {
    return <div className="p-8">数据加载中或暂无数据。</div>;
  }

  // ========== 以下是页面的UI渲染部分 ==========
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* 顶部筛选栏 */}
      <div className="mb-8 p-4 bg-white rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-2 mb-2">
          {['全部', '省部级课题', '横向课题'].map((label, idx) => {
            const typeMap = ['all', 'provincial', 'horizontal'];
            const typeKey = typeMap[idx];
            const isActive = filterType === typeKey;
            return (
              <button
                key={label}
                onClick={() => handleFilterClick(typeKey)}
                className={`px-4 py-2 rounded-lg font-medium ${isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="text-gray-600 text-sm">
          共 <span className="font-semibold">{researchData.length}</span> 个课题，
          当前显示 <span className="font-semibold">{filteredData.length}</span> 个
        </p>
      </div>

      {/* 主体：左右分栏布局 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧详情面板 */}
        <div className="lg:w-2/5 bg-white p-6 rounded-xl shadow-sm">
          {selectedItem ? (
            <>
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${selectedItem.type === 'provincial' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
                }`}>
                  {selectedItem.type === 'provincial' ? '省部级课题' : '横向课题'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedItem.title}</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedItem.tags?.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">详细摘要</h2>
                <p className="text-gray-700 leading-relaxed">{selectedItem.abstract}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">核心发现</h2>
                <ul className="space-y-2">
                  {selectedItem.coreFindings?.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="inline-block w-6 h-6 bg-gray-200 text-gray-700 rounded-full text-center text-sm leading-6 mr-3 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p>请从右侧选择一个课题</p>
          )}
        </div>

        {/* 右侧可滚动列表 */}
        <div className="lg:w-3/5">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto p-4">
              {filteredData.length === 0 ? (
                <p className="text-center py-8 text-gray-500">没有匹配的课题</p>
              ) : (
                filteredData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`p-4 mb-3 border rounded-lg cursor-pointer transition-all ${selectedId === item.id
                      ? 'border-blue-500 border-l-4 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded text-xs ${item.type === 'provincial' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                          }`}>
                            {item.type === 'provincial' ? '省级' : '横向'}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {item.tags?.slice(0, 2).join(' · ')}
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        {selectedId === item.id ? '✓' : '→'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Research;