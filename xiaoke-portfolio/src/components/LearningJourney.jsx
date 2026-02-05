import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Brain, ArrowDown } from 'lucide-react';

const LearningJourney = () => {
  const journeySteps = [
    {
      phase: "阶段一：初识 AI 编程",
      icon: <Sparkles size={20} />,
      content: "零代码基础出发，从畏难情绪到尝试用 Prompt 勾勒产品原型。不再被复杂的语法劝退，而是学会了如何用自然语言描述需求，迈出了创造的第一步。",
      tags: ["零基础", "Prompt入门", "原型设计"]
    },
    {
      phase: "阶段二：MVP 实战历练",
      icon: <Zap size={20} />,
      content: "在开发“极速截图”工具时，通过 AI 攻克了 EasyOCR 环境配置和打包难题。深刻理解了“先跑通再优化”的道理，在实战中与 AI 结成了紧密的结对编程伙伴。",
      tags: ["环境配置", "打包部署", "MVP思维"]
    },
    {
      phase: "阶段三：思维升维",
      icon: <Brain size={20} />,
      content: "不再纠结于语法细节，而是学习如何用结构化的 PRD 指挥 AI。现在我已经拥有了从点子到公网产品的全流程能力，成为了真正的“AI 产品经理”。",
      tags: ["结构化PRD", "全流程闭环", "思维升级"]
    }
  ];

  return (
    <section className="py-24 bg-pure-white border-t border-pure-black/5">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4 text-pure-black/40">
              <Brain size={24} />
              <span className="text-sm font-bold tracking-[0.2em] uppercase">Evolution</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">AI 编程进化论</h2>
            <p className="text-xl font-light text-pure-black/60">
              从畏惧代码到驾驭 AI，我的编程思维跃迁之路。
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[1px] bg-gradient-to-b from-pure-black/5 via-pure-black/20 to-pure-black/5 hidden md:block"></div>

          <div className="space-y-12 md:space-y-24">
            {journeySteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Content Card */}
                <div className="flex-1 w-full">
                  <div className={`p-8 bg-white border border-pure-black/5 rounded-sm shadow-sm hover:shadow-xl hover:border-pure-black/10 transition-all duration-500 group relative overflow-hidden ${
                    idx % 2 === 0 ? 'md:text-left' : 'md:text-right'
                  }`}>
                    {/* Background decoration */}
                    <div className={`absolute top-0 w-1 h-full bg-pure-black/5 ${
                       idx % 2 === 0 ? 'left-0' : 'right-0'
                    }`}></div>
                    
                    <div className={`flex items-center gap-3 mb-4 ${
                      idx % 2 === 0 ? 'justify-start' : 'md:justify-end'
                    }`}>
                      <span className="px-3 py-1 bg-pure-black text-pure-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Step 0{idx + 1}
                      </span>
                      <h3 className="text-xl font-bold">{step.phase}</h3>
                    </div>
                    
                    <p className="text-pure-black/60 leading-relaxed mb-6 font-light">
                      {step.content}
                    </p>

                    <div className={`flex flex-wrap gap-2 ${
                      idx % 2 === 0 ? 'justify-start' : 'md:justify-end'
                    }`}>
                      {step.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-pure-black/40 bg-pure-black/5 px-2 py-1 rounded-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center Icon Node */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-pure-white border border-pure-black/10 rounded-full flex items-center justify-center shadow-sm group">
                  <div className="text-pure-black/60 group-hover:text-pure-black transition-colors duration-300">
                    {step.icon}
                  </div>
                </div>

                {/* Empty Spacer for Layout Balance */}
                <div className="flex-1 hidden md:block"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Advice Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <div className="bg-pure-black text-pure-white p-8 md:p-12 rounded-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
            
            <h4 className="text-lg font-bold mb-6 tracking-widest uppercase flex items-center justify-center gap-2">
              <Sparkles size={18} /> 致同行者
            </h4>
            
            <div className="text-xl md:text-2xl font-light leading-relaxed font-serif italic">
              "我的建议：<span className="font-bold text-white not-italic">Prompt 工程</span> &gt; <span className="font-bold text-white not-italic">熟悉 AI 工具 (Trae/Cursor)</span> &gt; <span className="font-bold text-white not-italic">建立 MVP 意识</span>"
            </div>
            
            <div className="mt-8 opacity-40 text-xs tracking-[0.2em] uppercase">
              Start Your Journey Today
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningJourney;
