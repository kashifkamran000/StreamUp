import React from 'react'
import {motion} from 'framer-motion'
import { Link } from 'react-router-dom';
import secondsToHHMMSS from '../util/durationFormat'

function VideoCardMini({
    thumbnail = "",
    title = "",
    duration = "",
    views = "",
    ownerUsername = "",
    ownerAvatar = "",
    className = '',
    edit = false,
    to = '',
    videoLikes
}) {
 
    const durationStr = secondsToHHMMSS(duration);
  return (
    <motion.div 
    whileHover={{ scale: 1.02 }} 
    transition={{ duration: 0.2 }}
    className={`rounded-xl bg-white/5 h-60 grid relative hover:bg-white/10 w-[19rem] ml-5 border-2 border-gray-400/10 ${className}`}>
      
      <div className='flex justify-center items-center'>
      {edit && <Link to={`/video-manage/${to}`}><i class=" absolute fa-regular z-20 fa-pen-to-square text-lg bg-black/50 p-1 px-2 right-2 top-2 rounded-md hover:opacity-90 active:opacity-100"></i></Link> }
      <i className="fa-solid fa-play absolute text-5xl z-10 opacity-50  hover:opacity-70"></i>
      <img src={thumbnail} className='h-[9rem] w-full object-cover rounded-t-xl col-span-2 relative ' />
      </div>
       
        <div className='p-4 grid grid-rows-2'>
            <p className='text-xl font-normal mb-2'>{title}</p>
            <div className='flex items-center'>
               {ownerAvatar && <img src={ownerAvatar} className='rounded-full w-5 h-5' />}
               {ownerUsername && <p className='opacity-70 ml-2'>{ownerUsername}</p>}
            </div>
            <div className='opacity-65 absolute right-3 bottom-3 font-light text-sm'>{views}&nbsp;views</div>
        </div>
        <div className='p-2 rounded-lg bg-black/50 absolute right-[0.4rem] top-[6.4rem] text-sm'>{durationStr}</div>
        {videoLikes !== undefined && (
                <div className='opacity-65 z-20 absolute right-3 bottom-14 font-light text-sm'>{videoLikes}&nbsp;likes</div>
            )}
        
    </motion.div>
  )
}

export default VideoCardMini