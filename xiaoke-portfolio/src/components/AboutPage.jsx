import React from 'react';
import { motion } from 'framer-motion';
import siteData from '../data/siteData.json';
// 引入图标
import { Settings, Briefcase, Search, Cpu } from 'lucide-react';

const AboutPage = () => {
  // 1. 获取时间线数据
  const timeline = siteData.careerTimeline || [];

  // 2. 图标映射函数
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Settings': return <Settings size={20} />;
      case 'Briefcase': return <Briefcase size={20} />;
      case 'Search': return <Search size={20} />;
      case 'Cpu': return <Cpu size={20} />;
      default: return <Briefcase size={20} />;
    }
  };

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-5xl font-bold mb-16">关于我</h1>

        {/* AI 学习之路 */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold mb-10 text-gray-400">AI 学习之路 / LEARNING PATH</h2>
          <div className="grid md:grid-cols-2 gap-8">
             <div className="p-8 border border-gray-100 bg-gray-50 rounded-xl">
               <h3 className="font-bold mb-3 text-lg">起点：畏难与初识</h3>
               <p className="text-gray-600">从零代码基础开始，通过 AI 克服编程畏难情绪，开启创造之门。</p>
             </div>
             <div className="p-8 border border-gray-100 bg-gray-50 rounded-xl">
               <h3 className="font-bold mb-3 text-lg">顿悟：AI 是导师</h3>
               <p className="text-gray-600">意识到逻辑比语法更重要，AI 是释放个人创造力的最强杠杆。</p>
             </div>
          </div>
        </section>

        {/* 职业时间线 - 使用你 JSON 里的数据 */}
        <section>
          <h2 className="text-2xl font-bold mb-12 text-gray-400">历程 / EXPERIENCE</h2>
          <div className="relative border-l border-black ml-3 pl-10 space-y-16">
            {timeline.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* 时间轴上的图标圆点 */}
                <div className="absolute -left-[54px] top-0 w-7 h-7 rounded-full bg-white border border-black flex items-center justify-center shadow-sm">
                  {getIcon(item.icon)}
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-mono text-gray-400">{item.period}</span>
                  <h3 className="text-xl font-bold text-black">{item.stage}</h3>
                  <p className="text-gray-600 mt-2 leading-relaxed max-w-2xl">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;