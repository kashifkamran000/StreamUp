import React from 'react';
import Lottie  from 'lottie-react';
import LoadingCircularAni from '../../../assets/LoadingCircular.json'; 
const LoadingCircular = () => {
  return (
    <div className='flex justify-center items-center fixed top-0 z-50 w-full h-full bg-black/60'>
      <Lottie 
        animationData={LoadingCircularAni} 
        loop={true}
        autoplay={true}
        style={{ width: 300, height: 300 }}
      />
    </div>
  );
};

export default LoadingCircular;