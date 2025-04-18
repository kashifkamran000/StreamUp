import React from 'react'
import LogoHalf from '../../../assets/StreamUpHalf.svg'

function AboutWebsite() {
  return (
    <div className='h-[45rem] mt-16 w-svh grid grid-cols-2 place-content-evenly'>
        <div className='grid place-content-center'>
             <img src={LogoHalf} className='w-[19rem]' />
        </div>
        <div className='grid place-content-center'>
            <p className='text-white text-xl leading-[3rem] pr-32 font-extralight'><h1 className='text-5xl font-semibold mb-10'>Welcome to Our Website!</h1> Discover a platform designed to provide you with valuable content, seamless navigation, and a personalized user experience. Explore our features, stay informed with our latest updates, and enjoy a secure, accessible browsing experience from any device. Join us and make the most of what we have to offer!</p>
        </div>
    </div>
  )
}

export default AboutWebsite