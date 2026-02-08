import React from 'react';
import Hero from './Hero';
import ProjectGallery from './ProjectGallery';

const Home = () => {
  return (
    <div className="flex flex-col w-full bg-white">
      <Hero />
      <div className="w-full">
        <ProjectGallery />
      </div>
    </div>
  );
};

export default Home;