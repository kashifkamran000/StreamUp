import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import secondsToHHMMSS from '../../util/durationFormat'
import { useForm } from 'react-hook-form'
import qs from 'qs'
import CreatePlaylist from './CreatePlaylist';
import ErrorDisplay from '../../util/ErrorDisplay';


function Playlists() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [playlistData, setPlaylistData] = useState([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null); 
    const [videoList, setVideoList] = useState([]);
    const user = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();
    const [createBox, setCreateBox] = useState(false);
    const {register, handleSubmit, formState: {errors}, reset} = useForm();
    const [createloading, setCreateLoading] = useState(false);
    const [playlistMenu, setPlaylistMenu] = useState(false);

    const fetchPlaylistsData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/v1/playlist/user/${user._id}`, {
                withCredentials: true
            });
            setPlaylistData(response.data.data || []);
        } catch (error) {
            console.error("Error while fetching playlist data", error);
            setError(error.response?.data?.message || error.message || 'Unable to fetch playlists data, please try again!');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPlaylistsData();
    }, [fetchPlaylistsData]);

    const getVideoList = async (playlistId) => {
        setSelectedPlaylistId(playlistId); 
        setError(null);
        try {
            const response = await axios.get(`/api/v1/playlist/${playlistId}`, {
                withCredentials: true
            });
            if (response.status === 200) {
                setVideoList(response.data.data.video);
            }
        } catch (error) {
            console.error("Error while fetching video list", error);
            setError(error.response?.data?.message || error.message || 'Unable to fetch vidoes of playlist, please try again!');
            setSelectedPlaylistId(null); 
        }
    };

    const handleVideoRemove = async (playlistId, videoId) => {
        setError(null);
        try {
            const response = await axios.patch(`/api/v1/playlist/remove/${playlistId}/${videoId}`, { withCredentials: true });
            if (response.status === 200) {
                setVideoList(videoList.filter((video) => video._id !== videoId)); 
            }
        } catch (error) {
            console.error("Error while removing video", error);
            setError(error.response?.data?.message || error.message || 'Unable to remove video from playlist, please try again!');
        }
    };

    const handlePlaylestdelete = async(playlistId)=>{
        setError(null);
        try {
            const response = await axios.delete(`/api/v1/playlist/delete/${playlistId}`, {
                withCredentials: true
            });
            if(response.status===200){
                setPlaylistData(playlistData.filter((list)=> list._id != playlistId));
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to delete playlist, please try again!');
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
                fetchPlaylistsData();
                setCreateBox(false);
                reset(); 
            }
        } catch (error) {
            console.error("Error creating playlist:", error);
            setError(error.response?.data?.message || error.message || 'Unable to create new playlist, please try again!');
        } finally {
            setCreateLoading(false);
        }
    };

    const toggleMenu = (playlistId) => {
        setPlaylistMenu((prevState) => ({
            ...prevState,
            [playlistId]: !prevState[playlistId],
        }));
    };

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    if (error) {
        return <div className="text-white">Error: {error.message || error}</div>;
    }

    return (
        <div className='w-full h-full text-white grid place-content-center p-10 relative'>
            <div className='bg-gray-box border-2 border-gray-400/10 w-[40rem] p-7 rounded-xl relative'>
            <i onClick={()=>setCreateBox(true)} className="fa-solid fa-plus absolute right-10 p-1 text-lg top-5 opacity-70 hover:opacity-100"></i>
                <h2 className='text-xl mb-6'>Playlists</h2>
                {playlistData.length > 0 ? (
                    playlistData.map((list) => (
                        <motion.div
                            key={list._id}
                            onClick={() => getVideoList(list._id)}
                            className={`w-full mt-3 rounded-lg border-2 border-gray-400/10 p-4 relative  ${
                                selectedPlaylistId === list._id ? 'scale-105' : 'scale-100'
                            }`}
                            initial={{
                                background: 'linear-gradient(45deg, #0E0E12, #18181B)',
                                backgroundSize: '200% 200%',
                                backgroundPosition: '100% 70%',
                                scale: 1,
                            }}
                            whileHover={{
                                backgroundPosition: '0% 50%',
                                transition: { duration: 0.3, ease: "easeInOut" },
                                scale: selectedPlaylistId === list._id ? 1.05 : 1.04
                            }}
                            animate={{
                                backgroundPosition: '100% 50%',
                                transition: { duration: 0.3, ease: "easeInOut" },
                                scale: selectedPlaylistId === list._id ? 1.05 : 1,
                            }}
                        >
                            <p>{list.name}</p>
                            <p className='text-sm opacity-55 mt-2'>{list.description}</p>
                            <i onClick={()=>toggleMenu(list._id)} className="fa-solid fa-ellipsis-vertical absolute right-7 top-[1.1rem] hover:opacity-100 opacity-75 p-3 text-xl"></i>
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ 
                                    height: playlistMenu[list._id] ? 'auto' : 0, 
                                    opacity: playlistMenu[list._id] ? 1 : 0 
                                }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                className={`absolute z-50 bg-black w-[9rem] border-2 border-gray-400/10 rounded-xl -right-[7rem] top-[4rem]`}
                            >
                                <ul>
                                    <motion.li className='p-3 cursor-pointer text-sm'>
                                        Update Playlist
                                    </motion.li>
                                    <motion.li onClick={()=>handlePlaylestdelete(list._id)} className='p-3 cursor-pointer text-sm'>
                                        Delete
                                    </motion.li>
                                </ul>
                            </motion.div>
                            {selectedPlaylistId === list._id && (
                                videoList?.length > 0 ? (
                                    videoList.map((video) => (
                                        <motion.div
                                            key={video._id}
                                            className='overflow-hidden'
                                            initial={{ height: 0 }}
                                            animate={{
                                                height: 'auto',
                                                transition: { duration: 0.2, ease: 'easeInOut' }
                                            }}
                                        >
                                            <div className='mt-8 text-sm bg-gray-box border-2 border-gray-400/10 rounded-lg'>
                                                <div onClick={(e) => { e.stopPropagation(); navigate(`/video/${video._id}`) }} className='flex relative cursor-pointer'>
                                                    <img src={video.thumbnail} className='w-[10rem] h-[6rem] rounded-l-lg object-cover' />
                                                    <div className='m-4'>
                                                        <p className='text-base'>{video.title}</p>
                                                        <div className='flex mt-4'>
                                                            <img src={video.owner.avatar} className='h-5 w-5 rounded-full mr-2' />
                                                            <p>{video.owner.username}</p>
                                                            <p className='bg-black/50 rounded-md px-2 text-sm absolute left-20 bottom-3'>{secondsToHHMMSS(video?.duration)}</p>
                                                            <i onClick={(e) => { e.stopPropagation(); handleVideoRemove(list._id, video._id); }} className="fa-solid fa-trash absolute right-9 top-[1.8rem] hover:opacity-100 opacity-75 p-3"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className='my-4 text-center opacity-25'>This playlist is empty.</div>
                                )
                            )}
                        </motion.div>
                    ))
                ) : (
                    <div className='text-center my-10 opacity-55'>No playlists available</div>
                )}
            </div>

            <CreatePlaylist
                isOpen={createBox}
                onClose={() => setCreateBox(false)}
                onSubmit={createPlaylist}
                isLoading={loading}
            />
            {error!==null && <ErrorDisplay errorMessage={error} onClose={()=>setError(null)}/>}
        </div>
    );
}

export default Playlists;
