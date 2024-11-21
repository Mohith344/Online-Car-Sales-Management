import React, { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { SignInButton, useUser } from '@clerk/clerk-react';
import Header from './components/header';
import Hero from './components/Hero';
import Category from './components/Category';
import MostSearchedCar from './components/MostSearchedCar';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';
import SignUpForm from './components/SignUpForm';

function Home() {

  const { isSignedIn, user } = useUser();
  console.log('User:', user);
  return (
    <div>
      {/* Header */}
      <Header />
      {/* Hero section */}  
        <Hero />      
      {/* Categories */}
      <Category />
      {/* Most Searched Cars */}
      <MostSearchedCar />
      {/* Info Section */}
      <InfoSection />
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;