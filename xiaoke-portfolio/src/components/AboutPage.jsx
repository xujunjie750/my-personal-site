import React from 'react';
import { motion } from 'framer-motion';
import siteData from '../data/siteData.json';
import { Settings, Briefcase, Search, Cpu, BookOpen, AlertTriangle, Lightbulb } from 'lucide-react';

const AboutPage = () => {
  const { careerTimeline } = siteData;

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Settings': return <Settings size={24} />;
      case 'Briefcase': return <Briefcase size={24} />;
      case 'Search': return <Search size={24} />;
      case 'Cpu': return <Cpu size={24} />;
      default: return null;
    }
  };

  const learningPath = [
    {
      title: "心路历程：跨界转型",
      icon: <BookOpen size={24} />,
      content: "从工科背景的科技成果管理者，到沉入数字浪潮的 AI 工作流实践者。我意识到，技术不应是冰冷的壁垒，而应是释放创造力的杠杆。",
      highlight: "转型核心：拥抱不确定性，用工程思维解构艺术创作。"
    },
    {
      title: "避坑指南：轻量化的代价",
      icon: <AlertTriangle size={24} />,
      content: "在开发‘极速截图’时，曾盲目引入 EasyOCR，导致打包体积激增至 200MB+。后来通过 AI 辅助重构，切换至更轻量的离线识别方案，成功将体积压缩 75%。",
      highlight: "教训：不要为了一个功能引入整个生态，如无必要，勿增实体。"
    },
    {
      title: "方法论：MVP 思维",
      icon: <Lightbulb size={24} />,
      content: "完美是完成的敌人。在‘词意生花’项目中，我没有纠结于复杂的 UI，而是优先打通了阿里云百炼的 API 链路，确保‘心情 -> 宋词 -> 水墨画’的核心闭环。",
      highlight: "原则：先做核心功能，验证价值后再打磨细节。"
    }
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-pure-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-24"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-8">关于我</h1>
          <p className="text-xl font-light text-pure-black/60 leading-relaxed">
            从工程思维出发，在科技与艺术的交汇点寻找叙事的可能性。
          </p>
        </motion.div>

        {/* Learning Path Section (New) */}
        <div className="mb-32">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">AI 学习之路</h2>
            <div className="w-12 h-1 bg-pure-black"></div>
            <p className="mt-4 text-pure-black/40 font-light">从零开始的探索、试错与复盘</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {learningPath.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-light-grey/30 p-8 rounded-sm border border-pure-black/5 hover:border-pure-black/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-pure-black text-pure-white rounded-full flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-sm text-pure-black/60 font-light leading-relaxed mb-6">
                  {item.content}
                </p>
                <div className="p-4 bg-pure-white rounded-sm border-l-2 border-pure-black">
                  <p className="text-xs font-bold text-pure-black/80">{item.highlight}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Career Timeline */}
        <div className="relative">

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">职业时间线</h2>
            <div className="w-12 h-1 bg-pure-black"></div>
          </div>

          <div className="grid gap-12 relative">
            {/* Vertical Line */}
            <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-pure-black/5 hidden md:block"></div>

            {careerTimeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex flex-col md:flex-row gap-8 relative"
              >
                {/* Icon & Year Section */}
                <div className="flex items-center gap-6 md:w-48 shrink-0">
                  <div className="w-14 h-14 rounded-full bg-pure-black text-pure-white flex items-center justify-center z-10 shadow-xl">
                    {getIcon(item.icon)}
                  </div>
                  <div className="md:hidden">
                    <span className="text-xs font-bold tracking-widest text-pure-black/30 uppercase">{item.period}</span>
                    <h3 className="text-xl font-bold">{item.stage}</h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="md:pt-2">
                  <div className="hidden md:block mb-1">
                    <span className="text-xs font-bold tracking-widest text-pure-black/30 uppercase">{item.period}</span>
                  </div>
                  <h3 className="hidden md:block text-2xl font-bold mb-4">{item.stage}</h3>
                  <p className="text-lg font-light text-pure-black/60 leading-relaxed max-w-2xl">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vision Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 p-12 bg-light-grey/30 rounded-sm border border-pure-black/5"
        >
          <h2 className="text-2xl font-bold mb-6">核心愿景</h2>
          <p className="text-xl font-light text-pure-black/80 leading-relaxed italic">
            “在这个技术过载的时代，我致力于通过‘减法’与‘AI’，找回创作最纯粹的 VIBE。”
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
