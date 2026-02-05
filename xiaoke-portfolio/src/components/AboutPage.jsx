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
      title: "起点：畏难与初识",
      icon: <BookOpen size={24} />,
      content: "工科背景，零代码基础，面对编程全是畏难情绪。从最初连环境配置都搞不定，到尝试用 Prompt 勾勒产品原型，我迈出了最关键的一步。",
      highlight: "心路：技术不应是壁垒，而是释放创造力的杠杆。"
    },
    {
      title: "顿悟：AI 是导师",
      icon: <Lightbulb size={24} />,
      content: "在开发‘极速截图’时，通过不断修正 Prompt，我成功解决了 EasyOCR 打包体积过大的技术难题。我意识到，AI 不仅是助手，更是教我思考的导师。",
      highlight: "发现：只要逻辑跑通，AI 就能帮我搞定语法。"
    },
    {
      title: "方法论：MVP 思维",
      icon: <AlertTriangle size={24} />,
      content: "我的核心收获是‘MVP 思维’——不追求完美，先追求可用。在‘词意生花’项目中，优先打通核心闭环，而非纠结细枝末节。",
      highlight: "路径推荐：Prompt 撰写 -> 上手 Cursor/Trae -> 全栈部署 (Vercel)"
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
