import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import siteData from '../data/siteData.json';
import { LayoutGrid, Play, Code, Filter, Lightbulb, Target, Zap } from 'lucide-react';
import VideoModal from './VideoModal';
import IframeModal from './IframeModal';

const ProjectsPage = () => {
  const [filter, setFilter] = useState('全部');
  const [searchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [iframeModalOpen, setIframeModalOpen] = useState(false);
  const [currentIframeUrl, setCurrentIframeUrl] = useState('');
  const [currentIframeTitle, setCurrentIframeTitle] = useState('');
  const itemRefs = useRef({});

  // 核心逻辑：从 URL 获取选中 ID 并同步状态与滚动
  useEffect(() => {
    const selectedParam = searchParams.get('selected');
    if (selectedParam) {
      const id = selectedParam;
      const item = siteData.detailedProjects.find(i => i.id === id);
      if (item) {
        setFilter('全部');
        setSelectedId(id);
        
        setTimeout(() => {
          const element = itemRefs.current[id];
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [searchParams]);

  const categories = ['全部', 'AI工作流', '短视频作品', '代码项目'];

  const filteredProjects = filter === '全部' 
    ? siteData.detailedProjects 
    : siteData.detailedProjects.filter(p => p.category === filter);

  const getIcon = (category) => {
    switch (category) {
      case 'AI工作流': return <LayoutGrid size={16} />;
      case '短视频作品': return <Play size={16} />;
      case '代码项目': return <Code size={16} />;
      default: return null;
    }
  };

  const handleLinkClick = (e, project) => {
    if (project.videoUrl) {
      e.preventDefault();
      setCurrentVideoUrl(project.videoUrl);
      setVideoModalOpen(true);
    } else if (project.type === 'iframe') {
      e.preventDefault();
      setCurrentIframeUrl(project.link);
      setCurrentIframeTitle(project.name);
      setIframeModalOpen(true);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-pure-white selection:bg-pure-black selection:text-pure-white">
      <VideoModal 
        isOpen={videoModalOpen} 
        onClose={() => setVideoModalOpen(false)} 
        videoUrl={currentVideoUrl} 
      />
      <IframeModal
        isOpen={iframeModalOpen}
        onClose={() => setIframeModalOpen(false)}
        url={currentIframeUrl}
        title={currentIframeTitle}
      />
      
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4 text-pure-black/30">
              <LayoutGrid size={20} />
              <span className="text-sm font-bold tracking-widest uppercase">Works & Exploration</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tighter">作品集</h1>
            <p className="text-xl font-light text-pure-black/60 leading-relaxed">
              从 AI 驱动的自动化工作流，到充满叙事感的影像创作，再到追求极致体验的代码实现。
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-500 border ${
                  filter === cat 
                    ? 'bg-pure-black text-pure-white border-pure-black shadow-lg' 
                    : 'bg-transparent text-pure-black/40 border-pure-black/5 hover:border-pure-black/20 hover:text-pure-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                ref={el => itemRefs.current[project.id] = el}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className={`group flex flex-col bg-light-grey/20 rounded-sm overflow-hidden border transition-all duration-500 shadow-sm hover:shadow-xl ${
                  selectedId === project.id 
                  ? 'border-blue-500/50 ring-2 ring-blue-500/20 shadow-2xl scale-[1.02]' 
                  : 'border-transparent hover:border-pure-black/5'
                }`}
              >
                <div className="aspect-[16/10] overflow-hidden relative bg-light-grey group">
                  <img 
                    src={project.image} 
                    alt={project.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="flex items-center gap-2 px-3 py-1 bg-pure-white/90 backdrop-blur-sm text-pure-black text-[10px] font-bold tracking-widest uppercase rounded-full shadow-sm">
                      {getIcon(project.category)}
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-3 group-hover:translate-x-1 transition-transform">{project.name}</h3>
                  <p className="text-sm font-light text-pure-black/60 leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  {/* 核心思路模块 */}
                  {(project.painPoint || project.idea) && (
                    <div className="mb-6 p-4 bg-pure-white/50 rounded-sm border border-pure-black/5 space-y-3">
                      {project.painPoint && (
                        <div className="flex items-start gap-2">
                          <Target size={14} className="text-red-500 mt-0.5 shrink-0" />
                          <p className="text-xs text-pure-black/70 leading-relaxed"><span className="font-bold">痛点：</span>{project.painPoint}</p>
                        </div>
                      )}
                      {project.solution && (
                        <div className="flex items-start gap-2">
                          <Zap size={14} className="text-blue-500 mt-0.5 shrink-0" />
                          <p className="text-xs text-pure-black/70 leading-relaxed"><span className="font-bold">方案：</span>{project.solution}</p>
                        </div>
                      )}
                      {project.idea && (
                        <div className="flex items-start gap-2">
                          <Lightbulb size={14} className="text-yellow-500 mt-0.5 shrink-0" />
                          <p className="text-xs text-pure-black/70 leading-relaxed"><span className="font-bold">思路：</span>{project.idea}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-pure-black/5 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-pure-black/40 px-2 py-1 bg-pure-black/5 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => handleLinkClick(e, project)}
                        className="text-[10px] font-bold uppercase tracking-widest text-blue-600 border-b border-blue-600/30 hover:border-blue-600 transition-colors cursor-pointer"
                      >
                        {project.linkText || '查看详情'}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="py-32 text-center">
            <p className="text-pure-black/30 font-light italic">该分类下暂无作品</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
