import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import researchData from '../data/researchData';
import { ArrowRight, Beaker, Globe, ShieldCheck } from 'lucide-react';

const ResearchPreview = () => {
  // 选取前 3 个研究课题作为展示
  const featuredResearch = researchData.slice(0, 3);

  return (
    <section className="py-10 bg-white border-y border-pure-black/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4 text-blue-600">
              <Beaker size={20} />
              <span className="text-sm font-bold tracking-widest uppercase">Research Insights</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">深度洞察</h2>
            <p className="text-lg font-light text-pure-black/60">
              在视觉叙事之外，我也致力于产业技术路径与数字化转型的前沿研究。
            </p>
          </div>
          <Link 
            to="/research" 
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-blue-600 transition-colors"
          >
            查看所有报告 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredResearch.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group p-8 bg-gray-50 hover:bg-white border border-transparent hover:border-blue-500/20 hover:shadow-2xl transition-all duration-500 rounded-sm flex flex-col"
            >
              <div className="flex items-center gap-2 mb-6">
                {item.type === 'provincial' ? (
                  <Globe size={14} className="text-blue-500" />
                ) : (
                  <ShieldCheck size={14} className="text-green-500" />
                )}
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  item.type === 'provincial' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {item.type === 'provincial' ? '省部级课题' : '横向课题'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                {item.title}
              </h3>
              
              <p className="text-sm text-pure-black/50 font-light leading-relaxed mb-8 line-clamp-3 flex-1">
                {item.abstract}
              </p>

              <Link 
                to={`/research?selected=${item.id}`}
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border-b border-pure-black/10 pb-1 group-hover:border-blue-600 transition-colors"
              >
                阅读摘要
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchPreview;
