import React, { useState, useEffect } from 'react';
import Welcome from './Welcome';
import AboutWebsite from './AboutWebsite';
import HomeComponent from './HomeComponent';
import Video from '../../../assets/VideoStreaam.json';
import Profile from '../../../assets/Profile.json';
import Playlist from '../../../assets/Playlist.json';
import Community from '../../../assets/Community.json';
import Security from '../../../assets/Secure.json';
import { motion } from 'framer-motion';

function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAboutWebsite, setShowAboutWebsite] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setShowWelcome(false);
      const showAboutWebsiteTimer = setTimeout(() => {
        setShowAboutWebsite(true);
      }, 0); 
      return () => clearTimeout(showAboutWebsiteTimer);
    }, 8000);

    return () => clearTimeout(fadeOutTimer);
  }, []);

  return (
    <div className='h-fit'>
      <motion.div
        initial={{ opacity: 1, scale: 0.8 }}
        animate={{ opacity: showWelcome ? 1 : 0, scale: 1.1 }}
        transition={{ duration: 3 }} 
        style={{ display: showWelcome ? 'block' : 'none' }} 
      >
        <Welcome />
      </motion.div>

      
      {showAboutWebsite && (
        <motion.div
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }} 
        >
          <AboutWebsite />
          <HomeComponent
            animation={Video}
            heading='Stream Your Favorite Videos'
            para='Explore a wide range of videos on StreamUp. Browse, search, and watch content tailored to your interests with ease.'
          />
          <HomeComponent
            animation={Profile}
            heading='Personalized Profiles'
            para='Create and customize your profile with an avatar and cover image. Manage your watch history and favorites to enhance your streaming experience.'
          />
          <HomeComponent
            animation={Playlist}
            heading='Organize with Playlists'
            para='Create and manage playlists to keep your favorite videos organized. Share them with others or keep them for personal enjoyment.'
          />
          <HomeComponent
            animation={Community}
            heading='Engage with the Community'
            para='Follow channels, subscribe to content creators, and interact through comments and likes. Join a vibrant community of video enthusiasts.'
          />
          <HomeComponent
            animation={Security}
            heading='Secure and Smooth Experience'
            para='Enjoy a secure platform with robust authentication and data protection. StreamUp ensures your information is safe while providing a seamless experience.'
          />
        </motion.div>
      )}
    </div>
  );
}

export default Home;
