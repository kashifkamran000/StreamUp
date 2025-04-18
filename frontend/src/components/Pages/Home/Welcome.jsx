import React from 'react'
import Lottie from 'lottie-react'
import welcome from '../../../assets/Welcome.json'

function Welcome() {
  return (
    <div className='h-[57rem] grid place-content-center'>
      <Lottie
        animationData={welcome} 
        loop={true}
        autoplay={true}
        style={{ width: 500, height: 500 }}
      />
    </div>
  )
}

export default Welcome