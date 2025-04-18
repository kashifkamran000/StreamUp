import React, { useEffect, useState, useCallback } from 'react';
import VideoPlayer from '../util/videoPlayer/VideoPlayer';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoadingCircular from '../util/Loadings/LoadingCircular';
import { getSubscribers, toggleSubscribe } from '../../services/subscription';
import VideoComment from '../comment/VideoComment';
import timeCalculator from '../util/timeCalculator'
import { useSelector } from 'react-redux';
import { fetchVideoLike } from '../../services/likes';
import { Link } from 'react-router-dom';
import ShowPlaylists from './Playlists/ShowPlaylists';
import addToPlaylist from '../../services/playlist';
import CreatePlaylist from './Playlists/CreatePlaylist';
import ErrorDisplay from '../util/ErrorDisplay';

function Video() {
  const curUser = useSelector((state)=>state.auth.userData);
  const [videoData, setVideoData] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { videoId } = useParams();
  const [descriptionOverFlow, setDescriptionOverFlow] = useState(false);
  const [subscribed, setSubscribed] = useState();
  const [like, setLike] = useState();
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [createPlaylistBox, setCreatePlaylistBox] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [userPlaylistData, setUserPlaylistData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const getVideoData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/v1/video/${videoId}`, {
          withCredentials: true,
        });

        if (isMounted) {
          console.log(response.data.data.likeCheck);
          
          setVideoData(response.data.data);
          setLoading(false);
          if(response.data.data.likeCheck === 1){
            setLike(true);
          }else{
            setLike(false);
          }
          
        }
      } catch (error) {
        if (isMounted) {
          setError(error.response?.data?.message || error.message || 'Error fetching video data');
          setLoading(false);
        }
      }
    };

    getVideoData();

    return () => {
      isMounted = false;
    };
  }, [videoId]);

  useEffect(() => {
    if (videoData?.owner?._id) {
      const fetchSubscriber = async () => {
        const response = await getSubscribers(videoData.owner._id);
        setSubscriberCount(response.length);
        
        const checkSubscribe = response.filter(res => res.subscriber._id === curUser._id)
        if(checkSubscribe.length>0){
          setSubscribed(true)
        }else{
          setSubscribed(false)
        }
      };

      fetchSubscriber();
    }
  }, [videoData, subscribed]);

  const handleSubscribeToggle = async(channelId)=>{
    setError(null);
    try {
      await toggleSubscribe(channelId);
      setSubscribed(!subscribed);
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'An unexpected error while toggle subscribe');
      console.error("Error while toggling subscribe", error);
      
    }
  }

  const hangleVideoLikeToggle = async(videoId)=>{
    setError(null);
      try {
        const newLikeCount = await fetchVideoLike(videoId);
        const updatedVideoData = {...videoData};
        updatedVideoData.likeCount = newLikeCount;
        setVideoData(updatedVideoData);
        setLike(!like);
      } catch (error) {
        console.error("Error while toggling videoLike", error);
        setError(error.response?.data?.message || error.message || 'Unable to Like, please try agian!');
      }
  }

  const getUserPlaylist = useCallback(async(userId)=>{
    setError(null);
    try {
      const response = await axios.get(`/api/v1/playlist/user/${userId}`, {withCredentials: true});
      if(response.status === 200){
        setUserPlaylistData(response.data.data || [])
        setVideoMenu(false);
      }
    } catch (error) {
      console.error("Error while fetching playlist data", error);
      setError(error.response?.data?.message || error.message || "Unable to get user's playlist, please try again");
    }
  })

  const addVideoToPlaylist = async(playlistId, videoId)=>{
    setError(null);
    try {
      const response = await addToPlaylist(playlistId, videoId);
      if(response === 'ok'){
        setSelectedVideo(null);
        setAddPlaylistBox(false);
      }
    } catch (error) {
      console.error("Error while adding video to playlist:", error);
      setError(error.response?.data?.message || error.message || "Uable to add video to playlist, please try again!");
    }
  }

  const createPlaylist = async (data) => {
    setCreateLoading(true);
    setError(null);
    try {
        const formData = qs.stringify({
            name: data.name,
            description: data.description
        });

        const response = await axios.post('/api/v1/playlist/', formData, {
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded',
            },
            withCredentials: true
        });

        if (response.status === 200) {
            getUserPlaylist(user._id); 
            setCreatePlaylistBox(false);
        }
    } catch (error) {
        console.error("Error creating playlist:", error);
        setError(error.response?.data?.message || error.message || 'An error occurred while creating the playlist');
    } finally {
        setCreateLoading(false);
    }
};


  if (loading) {
    return (
      <div className='text-center'>
        <LoadingCircular/>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center text-red-500'>{error}</div>
    );
  }

  return (
    <div className='grid place-content-center relative'>
      <div className='text-white bg-gray-box rounded-3xl mt-10 mb-10 w-[70rem] relative'>
        {videoData && (
          <VideoPlayer
            src={videoData.videoFile}
            poster={videoData.thumbnail}
            width='100%'
            height='600px'
          />
        )}
        <div className='p-7'>
          <div className='text-2xl font-normal mb-8'>
            {videoData.title} 
          </div>
          <div className='grid grid-cols-12 gap-4 mb-8 w-full'>
          <Link to={`/profile/${videoData.owner.username}`}>
            <img src={videoData.owner.avatar} className='w-12 h-12 rounded-full' alt='Owner avatar' />
            </Link>
            <div className='col-span-2'>
              <Link to={`/profile/${videoData.owner.username}`}>
                 <p className='text-xl'>{videoData.owner.fullName}</p>
              </Link>
             
              <div className='opacity-75 flex '>
                {subscriberCount} <p className='ml-2'>Subscribers</p>
              </div>
            </div>

            <button onClick={()=>handleSubscribeToggle(videoData.owner._id)} className={` col-span-7 p-3 px-6  w-fit rounded-full ${subscribed ? 'bg-hopbush-main text-white active:bg-hopbush-600' : 'bg-white text-black active:bg-slate-100'}`}>{subscribed ? 'Subscribed' : 'Subscribe'}</button>
            <div className='col-span-2 flex justify-center items-center'>
              <i onClick={()=>hangleVideoLikeToggle(videoId)} className={`fa-heart text-2xl cursor-pointer mr-3 ${like ? 'text-red-700 fa-solid' : 'fa-regular'}`}></i>
                <p className='text-sm opacity-85'>{videoData.likeCount}</p>
                <i onClick={()=>{
                  setShowPlaylists(true);
                  getUserPlaylist(curUser._id)
                  }} 
                  className="fa-regular fa-bookmark ml-10 text-xl cursor-pointer"></i>
            </div>
          </div>
        
          <ShowPlaylists
            isOpen={showPlaylists}
            onClose={() => setShowPlaylists(false)}
            userPlaylistData={userPlaylistData}
            onAddToPlaylist={addVideoToPlaylist}
            onCreatePlaylist={() => setCreatePlaylistBox(true)}
            selectedVideo={videoData._id}
          />

          <CreatePlaylist
            isOpen={createPlaylistBox}
            onClose={()=>setCreatePlaylistBox(false)}
            isLoading={createLoading}
            onSubmit={createPlaylist}
          />
          

          <div className={`bg-white/10 rounded-xl p-5 relative ${descriptionOverFlow ? 'h-full' : 'h-[5.5rem]'} `}>
            <p className='font-light mb-2'>{videoData.views} views &nbsp;&nbsp;&nbsp; {timeCalculator(videoData.createdAt)}</p>
            <p className={`${descriptionOverFlow ? 'mb-8' : 'truncate mr-28'}`}>
                {videoData.description}
            </p>
            
            <button onClick={()=>setDescriptionOverFlow(!descriptionOverFlow)} className='absolute bottom-3 right-1 text-base w-[8rem]'>{descriptionOverFlow ? 'show less' : 'show more'}  </button>
          </div>
          
          <div className='rounded-[1.3rem] p-6 mt-6'>
           <VideoComment videoId={videoId}/>
          </div>
        </div>
      </div>
      {error!==null && <ErrorDisplay errorMessage={error} onClose={()=>setError(null)}/>}
    </div>
  );
}

export default Video;
