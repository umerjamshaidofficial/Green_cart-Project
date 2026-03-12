import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import BestSellers from '../components/BestSellers';
import Features from '../components/Features';
import Footer from '../components/Footer';


const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Categories />
      <BestSellers />
      <Features />
    </div>
  );
};

export default Home;