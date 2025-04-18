import React from 'react';
import Lottie  from 'lottie-react';
import uploadDone from '../../../assets/UploadDone.json'; 
const Loading = () => {
  return (
    <div className='flex justify-center items-center '>
      <Lottie 
        animationData={uploadDone} 
        loop={true}
        autoplay={true}
        style={{ width: 400, height: 400 }}
      />
    </div>
  );
};

export default Loading;