import React from 'react';
import { motion } from 'framer-motion';
import siteData from '../data/siteData.json';

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-bold leading-none mb-6">
            {siteData.personalInfo.welcomeMessage}
          </h1>
          <p className="text-xl md:text-2xl font-light text-pure-black/60 max-w-md">
            我是 <span className="text-pure-black font-medium">{siteData.personalInfo.name}</span>，{siteData.personalInfo.subTitle}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative aspect-[4/5] bg-light-grey overflow-hidden rounded-sm"
        >
          {siteData.personalInfo.avatar ? (
            <div className="absolute inset-0 w-full h-full bg-pure-white">
              <img 
                src={siteData.personalInfo.avatar} 
                alt={siteData.personalInfo.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 contrast-[1.1] brightness-[1.05] transition-all duration-700"
              />
              {/* Enhanced Film Grain Overlay */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
              {/* Vignette for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-pure-black/10 to-transparent pointer-events-none"></div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-pure-black/5 font-bold text-9xl select-none">
              {siteData.personalInfo.englishName.split(' ')[0]}
            </div>
          )}
          <div className="absolute inset-0 border-[20px] border-pure-white/20 pointer-events-none"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
