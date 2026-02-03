import React from 'react';
import { motion } from 'framer-motion';
import siteData from '../data/siteData.json';

const ExperienceTimeline = () => {
  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold mb-4">成长轨迹</h2>
            <p className="text-pure-black/40 font-light">2018年至今的职场成长与探索</p>
          </div>

          <div className="relative border-l-2 border-pure-black/5 ml-4 md:ml-32">
            {siteData.experience.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative pl-12 mb-12 group"
              >
                {/* Year Badge on the Left (Desktop) */}
                <div className="absolute hidden md:block -left-36 top-0 w-24 text-right">
                  <span className="text-xs font-bold tracking-widest text-pure-black/30 uppercase">{exp.year}</span>
                </div>

                {/* Dot */}
                <div className="absolute top-1 w-4 h-4 bg-pure-white border-2 border-pure-black rounded-full -left-[9px] z-10 transition-transform duration-300 group-hover:scale-125 group-hover:bg-pure-black"></div>

                <div className="bg-white p-8 rounded-sm border border-pure-black/5 hover:border-pure-black/10 hover:shadow-xl transition-all duration-500">
                  <span className="text-xs font-bold tracking-widest text-pure-black/30 uppercase mb-2 block md:hidden">{exp.year}</span>
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{exp.role}</h3>
                    <span className="hidden md:block text-pure-black/20">/</span>
                    <p className="text-lg font-medium text-pure-black/60">{exp.company}</p>
                  </div>
                  <p className="text-gray-500 font-light leading-relaxed max-w-2xl">{exp.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
