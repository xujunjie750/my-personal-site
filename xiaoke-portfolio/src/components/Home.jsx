import React from 'react';
import Hero from './Hero';
import ProjectGallery from './ProjectGallery';
import LearningJourney from './LearningJourney';
import ResearchPreview from './ResearchPreview';
import ExperienceTimeline from './ExperienceTimeline';

const Home = () => {
  return (
    <>
      <Hero />
      <ProjectGallery />
      <LearningJourney />
      <ResearchPreview />
      <ExperienceTimeline />
    </>
  );
};

export default Home;
