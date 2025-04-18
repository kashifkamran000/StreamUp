import React, { useCallback, useEffect, useState } from 'react'
import VideoPlayer from '../util/videoPlayer/VideoPlayer'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import qs from 'qs';
import ErrorDisplay from '../util/ErrorDisplay';

function VideoManage() {
    const {videoId} = useParams();
    const navigate = useNavigate();
    const [videoData, setVideoData] = useState();
    const [loading, setLoading] = useState();
    const [error, setError] = useState();
    const [updateDetails, setUpdateDetails] = useState(false);
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        defaultValues: {
            title: `${videoData?.title}`,
            description: `${videoData?.description}`,
          },
    });


    const fetchVideoData = useCallback( async(videoId)=>{
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/v1/video/${videoId}`, {
                withCredentials: true,
            })

            if(response.status===200){
                setVideoData(response.data.data);
            }
        } catch (error) {
            console.error("Error while fetching video data, " , error);
            setError(error.response?.data?.message || error.message || 'An unexpected error occurred');
        }finally{
            setLoading(false)
        }
    }, [])

    useEffect(()=>{
        fetchVideoData(videoId)
    }, [fetchVideoData])

    useEffect(() => {
        if (videoData) {
          reset({
            title: videoData.title || '',
            description: videoData.description || '',
          });
        }
      }, [videoData, reset]);

      const handleUpdateDetails = async (data) => {
        setError(null);
        if (!data.title && !data.description) {
            setUpdateDetails(!updateDetails);
            return;
        }
    
        const formData = {};
        if (data.title) formData.title = data.title;
        if (data.description) formData.description = data.description;
    
        const stringifiedData = qs.stringify(formData);
    
        try {
            const response = await axios.patch(`/api/v1/video/edit/${videoId}`, stringifiedData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials: true, 
            });
    
            if (response.status === 200) {
                setVideoData({
                    ...videoData,
                    title: response.data.data.title,
                    description: response.data.data.description,
                });
                setUpdateDetails(false);
            }
        } catch (error) {
            console.error("Error while updating video data", error);
            setError(error.response?.data?.message || error.message || "Unable to update video's details, please try again!");
        }
    };

    const handlePublish = async()=>{
        setError(null);
        try {
            const response = await axios.patch(`/api/v1/video/toggleIsPublished/${videoId}`, {
                withCredentials: true
            })

            if(response.status === 200){
                setVideoData({...videoData, isPublished: !videoData.isPublished})
            }
        } catch (error) {
            console.error("Error while toggle isPublish video", error);
            setError(error.response?.data?.message || error.message || 'An unexpected error occurred');
        }
    }

    const handleDeleteVideo = async()=>{
        setError(null);
        try {
            const response = await axios.delete(`/api/v1/video/delete/${videoId}`, {
                withCredentials: true
            })
            if(response.status === 200){
                navigate('/user-dashboard')
            }
        } catch (error) {
            console.error("Error while deleteing video", error);
            setError(error.response?.data?.message || error.message || 'Unable to delete Video!');
        }
    }

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    if (error) {
        return <div className="text-white">Error: {error}</div>;
    }

    if (!videoData) {
        return <div className="text-white">No video Data available</div>;
    }

  return (
    <div className='w-full h-full grid place-content-center p-10'>
        <div className='relative text-white w-[90rem] bg-gray-box border-2 border-gray-400/10 p-8 rounded-xl'>
            <div className='text-3xl my-5'>
                Manage Video:
            </div>
            <div className='grid grid-cols-2'>
                <div className='m-10 ml-0'>
                <VideoPlayer 
                        src={videoData.videoFile} 
                        poster={videoData.thumbnail} 
                        width='600px' height='400px'
                    />
                </div>
                <div className='m-10 ml-0 grid grid-rows-8 relative'>
                    <form onSubmit={handleSubmit(handleUpdateDetails)} className='row-span-7 grid grid-rows-7'>
                        <div className='p-2 row-span-2'>
                            {updateDetails ? 
                            <i onClick={()=>setUpdateDetails(!updateDetails)}  className="fa-solid fa-xmark absolute right-5 opacity-70 hover:opacity-90 active:opacity-70 text-2xl"></i>
                            :
                            <i onClick={()=>setUpdateDetails(!updateDetails)} className="absolute right-5 fa-regular fa-pen-to-square opacity-70 hover:opacity-90 active:opacity-70 text-2xl"></i>}  
                            <p className='text-xl'>Title:</p>
                            {updateDetails ? (
                                 <textarea 
                                 {...register('title')}
                                 error={errors.title?.message}
                                 labelClassName="text-white"
                                 className='bg-background-all focus:bg-background-all border-none p-2 rounded-lg resize-none mt-3'
                                 rows={1}
                                 cols={70}
                               />
                            ) : (
                                <p className='mt-3 p-2'>{videoData.title}</p>
                            )}
                        </div>
                        <div  className=' row-span-5 p-2 relative'>
                            <p className='text-xl'>Description:</p>

                            {updateDetails ? (
                                <textarea 
                                {...register('description')}
                                error={errors.description?.message}
                                labelClassName="text-white"
                                className='bg-background-all focus:bg-background-all border-none p-2 rounded-lg resize-none mt-3'
                                rows={6}
                                cols={70}
                              />
                            ) : (
                                <p className='mt-3 p-2'>{videoData.description}</p>
                            )}
                            {updateDetails && <button type='submit' className='p-1 px-4 rounded-full mt-5 bg-white text-black hover:scale-105 transition-all ease-in-out active:scale-100'>Save</button>}
                        </div>
                    </form>
                </div>
            </div>
            <div className='absolute top-14 right-14'>
                            <button onClick={handleDeleteVideo} className='bg-red-700 p-2 px-3 rounded-lg shadow-xl hover:bg-red-600 active:bg-red-700'>
                                Delete Video
                            </button>
                            <button onClick={handlePublish} className={`rounded-lg p-2 px-3 ml-10 shadow-xl ${videoData.isPublished ? 'bg-white text-black hover:bg-hopbush-100 active:bg-white' : 'bg-hopbush-main hover:bg-hopbush-600 active:bg-hopbush-main'}`}>
                                {videoData.isPublished ? 'Unpublish' : 'Pubilsh'}
                            </button>
                    </div>
        </div>
        {error!==null && <ErrorDisplay errorMessage={error} onClose={()=>setError(null)}/>}
    </div>
  )
}

export default VideoManage