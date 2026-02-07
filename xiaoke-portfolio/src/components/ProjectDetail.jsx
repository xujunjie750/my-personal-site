import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import siteData from '../data/siteData.json';
import { ArrowLeft, ExternalLink, Target, Settings, Lightbulb } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  
  // 对接 siteData.json 中的 detailedProjects 数组
  const project = siteData.detailedProjects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 opacity-20">作品未找到 (ID: {id})</h2>
          <Link to="/projects" className="text-black border-b border-black pb-1 uppercase text-xs font-bold tracking-widest">
            返回作品库
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white text-black">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link 
          to="/projects" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors mb-12"
        >
          <ArrowLeft size={14} /> 返回作品库
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 shadow-2xl border border-gray-200">
              <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {project.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wider">
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-2 block">{project.category}</span>
            <h1 className="text-4xl md:text-5xl font-black mb-10 leading-tight tracking-tighter">{project.name}</h1>

            <div className="space-y-10">
              <section className="border-l-2 border-gray-100 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <Target size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold uppercase tracking-widest">痛点场景</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{project.painPoint}</p>
              </section>

              <section className="border-l-2 border-gray-100 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <Settings size={18} className="text-blue-500" />
                  <h3 className="text-sm font-bold uppercase tracking-widest">MVP 方案</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{project.solution}</p>
              </section>

              <section className="border-l-2 border-gray-100 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <Lightbulb size={18} className="text-amber-500" />
                  <h3 className="text-sm font-bold uppercase tracking-widest">挖掘思路</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{project.idea}</p>
              </section>
            </div>

            <div className="pt-10 mt-10 border-t border-gray-100">
              <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-4 px-12 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl">
                立即访问项目 <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;