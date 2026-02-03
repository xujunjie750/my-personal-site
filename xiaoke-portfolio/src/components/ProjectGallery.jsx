import React from 'react';
import { motion } from 'framer-motion';
import siteData from '../data/siteData.json';
import { Link } from 'react-router-dom';

const ProjectGallery = () => {
  // Get 4 featured projects
  const featuredProjects = siteData.detailedProjects
    .filter(p => p.featured)
    .slice(0, 4);

  return (
    <section id="projects" className="py-24 bg-light-grey/30">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-4">精选作品</h2>
          <div className="w-20 h-1 bg-pure-black"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {featuredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to="/projects">
                <div className="relative overflow-hidden aspect-[16/10] bg-light-grey rounded-sm shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-pure-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="px-6 py-2 border border-pure-white text-pure-white text-xs font-bold tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      查看案例
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-pure-black/30">
                      {project.category}
                    </span>
                    <div className="flex gap-2">
                      {project.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] text-pure-black/60 bg-pure-black/5 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold group-hover:translate-x-1 transition-transform duration-300">
                    {project.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link 
            to="/projects"
            className="inline-block px-10 py-4 bg-pure-black text-pure-white text-xs font-bold tracking-widest uppercase hover:opacity-80 transition-opacity"
          >
            浏览全部作品
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;
