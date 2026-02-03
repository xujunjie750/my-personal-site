import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import siteData from '../data/siteData.json';
import { ArrowLeft, ExternalLink, Tool, Calendar, User, Briefcase } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const project = siteData.portfolio.projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">作品未找到</h2>
          <Link to="/projects" className="text-pure-black border-b border-pure-black pb-1 uppercase text-xs font-bold tracking-widest">
            返回作品库
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-pure-white">
      <div className="container mx-auto px-6">
        <Link 
          to="/projects" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-pure-black/40 hover:text-pure-black transition-colors mb-12"
        >
          <ArrowLeft size={14} /> 返回作品库
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-[3/2] overflow-hidden rounded-sm bg-light-grey shadow-2xl">
              <img 
                src={project.image} 
                alt={project.name} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-pure-black/40 mb-4 block">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              {project.name}
            </h1>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-pure-black/30">
                  <Briefcase size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">客户 / 类型</span>
                </div>
                <p className="font-medium">{project.client}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-pure-black/30">
                  <User size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">我的角色</span>
                </div>
                <p className="font-medium">{project.role}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-pure-black/30">
                  <Calendar size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">项目周期</span>
                </div>
                <p className="font-medium">{project.period}</p>
              </div>
            </div>

            <div className="mb-12">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-pure-black/30 mb-4">详细描述</h4>
              <p className="text-lg font-light text-pure-black/60 leading-relaxed italic border-l-2 border-pure-black/5 pl-6">
                {project.description}
              </p>
            </div>

            <div className="mb-12">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-pure-black/30 mb-4">核心工具</h4>
              <div className="flex flex-wrap gap-2">
                {project.tools.map(tool => (
                  <span key={tool} className="px-4 py-1.5 bg-light-grey text-pure-black text-xs font-medium rounded-full">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <a 
              href={project.portfolioLink} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-pure-black text-pure-white text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              查看完整作品集 <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
