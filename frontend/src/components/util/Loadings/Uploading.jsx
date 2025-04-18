import React from 'react';
import Lottie  from 'lottie-react';
import uploading from '../../../assets/Uploading.json'; 
const Loading = () => {
  return (
    <div className='flex justify-center items-center '>
      <Lottie 
        animationData={uploading} 
        loop={true}
        autoplay={true}
        style={{ width: 500, height: 500 }}
      />
    </div>
  );
};

export default Loading;