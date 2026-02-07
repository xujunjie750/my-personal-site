import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import siteData from '../data/siteData.json';

const ProjectGallery = () => {
  const projects = siteData.detailedProjects || [];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Link to={`/project/${project.id}`}>
                <div className="aspect-video overflow-hidden bg-gray-100 rounded-lg mb-4">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;