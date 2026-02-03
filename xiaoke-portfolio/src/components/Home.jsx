import React from 'react';
import Hero from './Hero';
import ProjectGallery from './ProjectGallery';
import ResearchPreview from './ResearchPreview';
import ExperienceTimeline from './ExperienceTimeline';

const Home = () => {
  return (
    <>
      <Hero />
      <ProjectGallery />
      <ResearchPreview />
      <ExperienceTimeline />
    </>
  );
};

export default Home;
