import React from 'react'
import Lottie from 'lottie-react'

function Home1({
    animation = "",
    heading = "",
    para = ""
}) {
  return (
    <div className='h-[45rem] w-svh grid grid-cols-2 place-content-center'>
        <div className='grid place-content-center'>
             <Lottie
                animationData={animation}
                loop={true}
                autoplay={true}
                style={{ width: 400, height: 400 }}
             />
        </div>
        <div className='grid place-content-center'>
            <p className='text-white text-xl leading-[3rem] pr-32 font-extralight'><p className='text-4xl font-semibold mb-8'>{heading}</p> 
            {para}
            </p>
        </div>
    </div>
  )
}

export default Home1