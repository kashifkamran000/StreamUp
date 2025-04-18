import React from 'react';
import Lottie  from 'lottie-react';
import animationData from '../../../assets/Animation - 1725005426996.json'; 
const Loading = () => {
  return (
    <div className='flex justify-center items-center fixed top-0 z-50 w-full h-full bg-hopbush-900/10'>
      <Lottie 
        animationData={animationData} 
        loop={true}
        autoplay={true}
        style={{ width: 400, height: 400 }}
      />
    </div>
  );
};

export default Loading;