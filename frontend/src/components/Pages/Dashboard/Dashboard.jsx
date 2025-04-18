import React, { useEffect, useState, useRef } from 'react'
import img from '../../../assets/4.jpg'
import {motion, AnimatePresence} from 'framer-motion'
import axios from 'axios'
import timeCalculator from '../../util/timeCalculator'
import VideoCardMini from '../../videoCards/VideoCardMini'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Slide.css'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Input from '../../util/Input';
import Button from '../../util/Button'
import qs from 'qs';
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorDisplay from '../../util/ErrorDisplay'

function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [watchHistory, setWatchHistory] = useState([]);
    const [channelVideo, setChannelVideo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updateDetailBox, setUpdateDetailBox] = useState(false);
    const { register: registerUpdateDetails, handleSubmit: handleDetailsSubmit, formState: { errors: errorsDetails }, reset: resetDetails } = useForm();
    const { register: registerUpdateAvatar, handleSubmit: handleAvatarSubmit, formState: { errors: errorsAvatar }, reset: resetAvatar } = useForm();
    const { register: registerUpdateCoverImage, handleSubmit: handleCoverImageSubmit, formState: { errors: errorsCoverImage }, reset: resetCoverImage } = useForm();
    const [editAvatarBox, setEditAvatarBox] = useState(false);
    const [editCoverImageBox, setEditCoverImageBox] = useState(false);
    const [chooseEditImages, setChooseEditImages] = useState(false);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);
    const [dashboardMenu, setDashboardMenu] = useState(false);
    const navigate = useNavigate();


    const settings = {
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 3
      };

      const fetchDashboardData = useCallback(async () => {
          setLoading(true)
          setError(null);
          try {
              const response = await axios.get('/api/v1/dashboard/stats', {
                  withCredentials: true
              })

              if (response.status === 200) {
                  const { userId, findVideosOfChannel } = response.data.data
                  setUserData(userId)
                  setWatchHistory(userId.watchHistory)
                  setChannelVideo(findVideosOfChannel)
              }
          } catch (error) {
              console.error("Error while fetching dashboard data", error)
              setError(error.response?.data?.message || error.message || "Unable to fetch Dashboard Data, please try again!")
          } finally {
              setLoading(false)
          }
      }, [])

      useEffect(() => {
          fetchDashboardData()
      }, [fetchDashboardData])

    const handleClearHistory = async()=>{
      setError(null);
      try {
        setLoading(true)
        const response = await axios.get(`api/v1/user/clearhistory`, {
          withCredentials: true
        })
        if(response.status===200){
          setWatchHistory([])
        }
      } catch (error) {
        console.error("Error while cleaing history", error);
        setError(error.response?.data?.message || error.message || "Unable to clear history, please try agian!");
      }finally{
        setLoading(false)
      }
    }

    const updateDetails = async (data) => {
      setError(null);
      if (!data.fullName && !data.email) {
          return alert('At least one field (Full Name or Email) is required to update!');
      }

      const formData = {};
      if (data.fullName) formData.fullName = data.fullName;
      if (data.email) formData.email = data.email;


      const stringifiedData = qs.stringify(formData);

      try {
          const response = await axios.patch('/api/v1/user/update-account', stringifiedData, {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
              withCredentials: true
          });

          if (response.status === 200) {
              setUpdateDetailBox(false);
              resetDetails();
              setUserData({...userData, fullName: response.data.data.fullName, email: response.data.data.email});
          }
      } catch (error) {
          console.error('Update Failed:', error);
          console.error('Error response:', error.response);
          setError(error.response?.data?.message || error.message || "Unable to update user's profile, please try again!")
      }
    }

    const updateAvatar = async(data)=>{
      setError(null);
      const formData = new FormData()
      formData.append('avatar', data.avatar[0])
      try {
        const response = await axios.patch('/api/v1/user/avatar', formData, {
          headers:{
           'Content-Type' : 'multipart/form-data', 
           withCredentials: true
          }
        })

        if(response.status === 200){
          const newAvatar = `${response.data.data.avatar}?t=${new Date().getTime()}`;
          setEditAvatarBox(false);
          resetAvatar();
          setUserData({...userData, avatar: newAvatar})
        }
      } catch (error) {
        console.error('Update Avatar Fail:', error.response ? error.response.data : error.message);
        setError(error.response?.data?.message || error.message || "Unable to update user's avatar, please try again!")
      }
    }

    const coverImageUpdate = async(data)=>{
      setError(null);
      const formData = new FormData()
      formData.append('coverImage', data.coverImage[0])
      try {
        const response = await axios.patch('/api/v1/user/cover-image', formData, {
          headers:{
           'Content-Type' : 'multipart/form-data', 
           withCredentials: true
          }
        })

        if(response.status === 200){
          const newCoverImage = `${response.data.data.avatar}?t=${new Date().getTime()}`;
          setEditCoverImageBox(false);
          resetCoverImage();
          setUserData({...userData, coverImage: newCoverImage})
        }
      } catch (error) {
        console.error('Update Avatar Fail:', error.response ? error.response.data : error.message);
        setError(error.response?.data?.message || error.message || "Unable to update user's coverimage, please try again!")
      }
    }

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    if (error) {
        return <div className="text-white">Error: {error}</div>;
    }

    if (!userData) {
        return <div className="text-white">No user data available</div>;
    }

  return (
    <div className="grid place-content-center relative">   
        <div className='text-white bg-gray-box rounded-3xl  mt-10 mb-10  w-[70rem] relative border-2 border-gray-400/10'>
          <img src={userData.coverImage ? userData.coverImage : img} alt="CoverImage" className='rounded-t-3xl w-full h-[25rem] object-cover shadow-inner '/>
          <div>
              <i onClick={()=>setChooseEditImages(!chooseEditImages)}  className="fa-regular fa-pen-to-square text-3xl absolute right-4 top-3 bg-black/70 rounded-md p-2 opacity-80 hover:opacity-100 active:opacity-80"></i>
          </div>

          <div>
          <motion.div
              initial={{ height: "0px", width: "0px"}} 
              animate={{ height:  chooseEditImages ? "110px" : "0px", width: chooseEditImages ? "175px" : "0px", display: chooseEditImages ? 'block' : 'none' }} 
              transition={{ duration: 0.2, }} 
              style={{ overflow: 'hidden' }}
              className="absolute border-2 border-gray-400/10 bg-background-all rounded-lg right-16 top-14 opacity-80 grid grid-rows-2 place-content-center">
                    <div onClick={()=>setEditCoverImageBox(!editCoverImageBox)} className={`p-3 hover:bg-black/90 `}>
                        Edit Cover Image
                    </div>
                    <div onClick={()=>setEditAvatarBox(!editAvatarBox)} className={`p-3 hover:bg-black/90 `}>
                        Edit Avatar
                    </div>
            </motion.div>
          </div>
         
          <motion.img 
            src={userData.avatar} 
            alt="ProfileImage" 
            className='w-[15rem] h-[15rem] rounded-full -mt-[7rem] ml-10 shadow-xl border-[0.5rem] object-cover border-gray-box cursor-pointer'
            onClick={() => setAvatarModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        />
        <button onClick={()=>navigate('/newvideo')} className='bg-hopbush-main p-3 px-5 rounded-full absolute right-[8rem] top-[28rem] flex justify-center items-center hover:bg-hopbush-main/70 active:bg-hopbush-main'><i className="fa-solid fa-cloud-arrow-up mr-3 text-2xl"></i>Publish Video</button>

        <i onClick={()=>setDashboardMenu(!dashboardMenu)} className="fa-solid fa-ellipsis-vertical absolute right-[4rem] top-[28rem] text-xl p-3 hover:bg-background-all rounded-lg cursor-pointer z-30"></i>
        <motion.div 
        initial={{height: 0, opacity: 0}}
        animate={{ height: dashboardMenu ? 'auto' : 0, opacity: dashboardMenu ? 1 : 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={`absolute bg-black w-[12rem] border-2 border-gray-400/10 rounded-xl -right-[7.7rem] top-[31rem]`}>
          <ul>
              <motion.li 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: dashboardMenu ? 1 : 0, y: dashboardMenu ? 0 : -20 }}
                transition={{ duration: 0.2, delay: 0.2, ease: 'easeInOut' }}
                className='p-5 cursor-pointer'
              >
                <Link to='/user/change-password' className="block w-full h-full">
                  Change Password
                </Link>
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: dashboardMenu ? 1 : 0, y: dashboardMenu ? 0 : -20 }}
                transition={{ duration: 0.2, delay: 0.2, ease: 'easeInOut' }}
                className='p-5 cursor-pointer'
              >
                <Link to='/user/playlists' className="block w-full h-full">
                  Playlists
                </Link>
              </motion.li>
          </ul>
        </motion.div>


          <div className='-top-20 relative ml-[4rem] mr-[4rem] h-[5rem] grid grid-cols-5 gap-5 mt-28'>
            <div className={`bg-white/5 rounded-xl p-8 relative shadow-xl border-2  border-gray-400/10 ${channelVideo?.length > 0 ? 'col-span-3' : 'col-span-5'}`}>
              <i onClick={()=>setUpdateDetailBox(!updateDetailBox)} className="fa-regular fa-pen-to-square absolute right-8 text-xl opacity-60 hover:opacity-90 cursor-pointer" ></i>
              <p className='text-3xl font-semibold mb-3'>
              {userData.fullName}
                </p>
                <p className='font-light opacity-80 mb-6'>
                @{userData.username}<br/>
                </p>
                <p className='text-lg '>
                Email: &nbsp; &nbsp; {userData.email}
                </p>
                <p className='text-lg opacity-50 absolute bottom-6'>
                Joined: &nbsp; &nbsp; {timeCalculator(userData.createdAt)}
                </p>
            </div>
            <div className={`bg-white/5 rounded-xl p-8 col-span-2 border-2  border-gray-400/10 shadow-xl ${channelVideo?.length > 0 ? 'block' : 'hidden'}`}>
              <p className='text-xl font-light mb-6 leading-loose'>
                Total Channel Subscribers:<br/> {userData.subscribersCount}
              </p>
              <p className='text-xl font-light leading-loose'>
                Total Subscribed Channel:<br/>  {userData.subscribedChannelsCount}
              </p>
            </div>
          </div>   

          <div className='mt-32'>
            {watchHistory && watchHistory.length && <div className="mb-10 m-12">
              <div className='mb-8 pt-10 flex justify-between'>
                <div className='text-3xl '>
                  Watch History
                </div>
                <div>
                  <button className={`bg-white/10 p-3 rounded-xl hover:bg-white/5 shadow-xl active:opacity-70 text-sm mr-4`} onClick={handleClearHistory}>
                      <i class="fa-regular fa-trash-can mr-2"></i>
                      Clear History
                  </button>
                </div>
              </div>
              <Slider {...settings}>
                  {watchHistory.map((video, index) => (
                    <Link to={`/video/${video._id}`}>
                      <div key={index}>
                          <VideoCardMini
                          thumbnail={video.thumbnail}
                          title={video.title}
                          ownerAvatar={video.owner.avatar}
                          ownerUsername={video.owner.username}
                          duration={video.duration}
                          views={video.views}
                          />
                      </div>
                    </Link>
                  ))}
              </Slider>
            </div>}

            {channelVideo && channelVideo.length>0 && <div className=' m-6 mt-20 mb-12'>
              <div className='text-3xl ml-4'>Channel Videos</div>
                <div className='grid grid-cols-3 gap-y-10 place-content-center mt-10'>
                  {
                    channelVideo.map((video, index)=>(
                      <div key={index}>
                        <Link to={`/video/${video._id}`}>
                          <div key={index}>
                              <VideoCardMini
                              thumbnail={video.thumbnail}
                              title={video.title}
                              duration={video.duration}
                              views={video.views}
                              edit = 'true'
                              to = {video._id}
                              videoLikes={video.likes}
                              className='w-[20rem]'
                              />
                          </div>
                        </Link>
                      </div>
                    ))
                  }
                </div>
              </div>}
                
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: updateDetailBox ? 1 : 0 }} 
                transition={{ duration: 0.1 }} 
                className={`fixed top-0 left-0 right-0 bottom-0 z-20 bg-black/60 w-full h-full ${updateDetailBox ? 'grid' : 'hidden'} place-content-center`}
              >
                <motion.div 
                  initial={{ y: 30 }} 
                  animate={{ y: updateDetailBox ? 0 : 30 }} 
                  transition={{ duration: 0.2, ease: "easeInOut" }} 
                  className='bg-gray-box p-20 rounded-2xl relative'
                >
                  <i 
                    className="fa-solid fa-xmark text-white absolute right-10 top-10 text-xl opacity-60 hover:opacity-90" 
                    onClick={() => setUpdateDetailBox(!updateDetailBox)}
                  ></i>
                  
                  <form  onSubmit={handleDetailsSubmit(updateDetails)}>
                    <Input 
                      label="Full Name:"
                      {...registerUpdateDetails('fullName')}
                      error={errorsDetails.fullName?.message}
                      labelClassName="text-white"
                    />
                    <Input 
                      label="Email:"
                      type='email'
                      {...registerUpdateDetails('email')}
                      error={errorsDetails.email?.message}
                      labelClassName="text-white"
                    />
                    <Button
                      type='submit'
                      className='mt-4'
                    >
                      Update
                    </Button>
                  </form>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: editCoverImageBox ? 1 : 0 }} 
                transition={{ duration: 0.1 }} 
                className={`fixed top-0 left-0 right-0 bottom-0 z-20 bg-black/60 w-full h-full ${editCoverImageBox ? 'grid' : 'hidden'} place-content-center`}
              >
                <motion.div 
                  initial={{ y: 30 }} 
                  animate={{ y: editCoverImageBox ? 0 : 30 }} 
                  transition={{ duration: 0.2, ease: "easeInOut" }} 
                  className='bg-gray-box p-20 rounded-2xl relative'
                >
                  <i 
                    className="fa-solid fa-xmark text-white absolute right-10 top-10 text-xl opacity-60 hover:opacity-90 bg-white/20 px-2 rounded-full" 
                    onClick={() => setEditCoverImageBox(!editCoverImageBox)}
                  ></i>
                  
                  <form onSubmit={handleCoverImageSubmit(coverImageUpdate)}>
                    <Input 
                      label="Cover Image:"
                      type='file'
                      accept='image/*'
                      {...registerUpdateCoverImage('coverImage', { required: 'CoverImage is required' })}
                      error={errorsCoverImage.coverImage?.message}
                      labelClassName="text-white"
                    />
                    
                    <Button
                      type='submit'
                      className='mt-4'
                    >
                      Update
                    </Button>
                  </form>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: editAvatarBox ? 1 : 0 }} 
                transition={{ duration: 0.1 }} 
                className={`fixed top-0 left-0 right-0 bottom-0 z-20 bg-black/60 w-full h-full ${editAvatarBox ? 'grid' : 'hidden'} place-content-center`}
              >
                <motion.div 
                  initial={{ y: 30 }} 
                  animate={{ y: editAvatarBox ? 0 : 30 }} 
                  transition={{ duration: 0.2, ease: "easeInOut" }} 
                  className='bg-gray-box p-20 rounded-2xl relative'
                >
                  <i 
                    className="fa-solid fa-xmark text-white absolute right-10 top-10 text-xl opacity-60 hover:opacity-90 bg-white/20 px-2 rounded-full" 
                    onClick={() => setEditAvatarBox(!editAvatarBox)}
                  ></i>
                  
                  <form onSubmit={handleAvatarSubmit(updateAvatar)}>
                    <Input 
                      label="Avatar:"
                      type='file'
                      accept='image/*'
                      {...registerUpdateAvatar('avatar', { required: 'Avatar is required' })}
                      error={errorsAvatar.avatar?.message}
                      labelClassName="text-white"
                    />
                    
                    <Button
                      type='submit'
                      className='mt-4'
                    >
                      Update
                    </Button>
                  </form>
                </motion.div>
              </motion.div>
            
          </div>
    </div>

    <AnimatePresence>
          {avatarModalOpen && (
              <motion.div 
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setAvatarModalOpen(false)}
              >
                  <motion.div
                      className="bg-gray-box p-4 rounded-lg"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      onClick={(e) => e.stopPropagation()}
                  >
                      <img 
                          src={userData.avatar} 
                          alt="ProfileImage" 
                          className="w-[30rem] h-[30rem] object-cover rounded-lg"
                      />
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      
      {error!==null && <ErrorDisplay errorMessage={error} onClose={()=>setError(null)}/>}
    </div>
  )
}

export default Dashboard