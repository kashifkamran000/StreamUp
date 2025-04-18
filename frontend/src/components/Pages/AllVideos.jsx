import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import timeCalculator from '../util/timeCalculator';
import { useNavigate } from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion'
import { useSelector } from 'react-redux';
import secondsToHHMMSS from '../util/durationFormat';
import addToPlaylist from '../../services/playlist';
import CreatePlaylist from './Playlists/CreatePlaylist'
import qs from 'qs'
import ShowPlaylists from './Playlists/ShowPlaylists'
import ErrorDisplay from '../util/ErrorDisplay';

const AllVideos = ({ query }) => {
  const user = useSelector((state)=>state.auth.userData);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('createdAt_desc');
  const navigate = useNavigate();
  const [videoMenu, setVideoMenu] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [addPlaylistBox, setAddPlaylistBox] = useState(false);
  const [userPlaylistData, setPlaylistData] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [createPlaylistBox, setCreatePLaylistBox] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const isUsernameQuery = (query) => query.startsWith('@');

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null); 
    try {
      const sortBy = sortOption.split('_')[0];
      const sortType = sortOption.split('_')[1];
      const searchParams = {
        page,
        limit,
        sortBy,
        sortType
      };

      if (query.trim() === '') {
        delete searchParams.username;
        delete searchParams.query;
      } else if (isUsernameQuery(query)) {
        searchParams.username = query.slice(1);
        delete searchParams.query;
      } else {
        searchParams.query = query;
        delete searchParams.username;
      }

      const response = await axios.get('/api/v1/video', {
        params: searchParams,
        withCredentials: true,
      });
      setVideos(response.data.data.docs || []);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching videos:', err); 
      setError(error.response?.data?.message || error.message || 'Error fetching videos');
    } finally {
      setLoading(false);
    }
  }, [query, page, limit, sortOption]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1)); 
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const toggleVideoMenu = (videoId) => {
      setVideoMenu((prevState) => ({
          ...prevState,
          [videoId]: !prevState[videoId],
      }));
  };

  const getUserPlaylist = useCallback(async(userId)=>{
    setError(null);
    try {
      const response = await axios.get(`/api/v1/playlist/user/${userId}`, {withCredentials: true});
      if(response.status === 200){
        setPlaylistData(response.data.data || [])
        setVideoMenu(false);
      }
    } catch (error) {
      console.error("Error while fetching playlist data", error);
      setError(error.response?.data?.message || error.message || "Unable to get user's playlist");
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
      setError(error.response?.data?.message || error.message || 'Unable to add video to playlist, please try again');
    }
  }

  const createPlaylist = async (data) => {
    setError(null);
    setCreateLoading(true);
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
            setCreatePLaylistBox(false);
        }
    } catch (error) {
        console.error("Error creating playlist:", error);
        setError(error.response?.data?.message || error.message || 'An error occurred while creating the playlist');
    } finally {
        setCreateLoading(false);
    }
};

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">All Videos</h2>

        {/* Combined Sorting Control */}
        <div>
          <label className="text-white mr-4">Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border-2 border-gray-400/10 text-white p-2 shadow-xl rounded bg-hopbush-main/70"
          >
            <option value="createdAt_desc">Created At Descending</option>
            <option value="createdAt_asc">Created At Ascending</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(videos) && videos.length > 0 ? (
          videos.map(video => (
            <motion.div 
            whileHover={{ scale: 1.02 }} 
            transition={{ duration: 0.2 }}
            key={video._id} 
            onClick={()=>navigate(`/video/${video._id}`)} 
            className="bg-gray-box relative border-2 cursor-pointer border-gray-400/10 text-white rounded-lg shadow-md">
              <img loading='lazy' src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover rounded-t-lg" />
              <div className="p-4">
                <div className='flex justify-between'>
                  <h3 className="text-lg font-semibold mb-2 truncate">{video.title}</h3>
                  <i onClick={(e)=>{e.stopPropagation(); toggleVideoMenu(video._id)}} className="fa-solid fa-ellipsis-vertical p-2 text-lg opacity-75 hover:opacity-100 active:opacity-75"></i>
                  <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                          height: videoMenu[video._id] ? 'auto' : 0, 
                          opacity: videoMenu[video._id] ? 1 : 0 
                      }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className={`absolute z-50 bg-black w-[8.5rem] border-2 border-gray-400/10 rounded-xl right-[2rem] top-[15.5rem]`}
                  >
                      <ul>
                          <motion.li 
                          initial={{scale: 1}}
                          whileHover={{scale: 1.05}}
                          onClick={(e)=>{
                            e.stopPropagation(); 
                            getUserPlaylist(user._id); 
                            setAddPlaylistBox(true); 
                            setSelectedVideo(video._id)
                          }} 
                            className='p-3 cursor-pointer text-sm text-white/90 hover:text-white'>
                               Add To Playlist
                      </motion.li>
                      </ul>
                   </motion.div>
                </div>
                <p className="text-xs mb-1 text-white/70">{video.owner?.fullName || 'Unknown'}</p>
                <p className="text-xs mb-1 text-white/70">{video.views}&nbsp;Views &nbsp;&nbsp;&nbsp;{timeCalculator(video.createdAt)}</p>
                <p className='absolute right-[0.5rem] top-[10rem] bg-black/50 rounded-md px-2 text-sm'>{secondsToHHMMSS(video.duration)}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center col-span-full">No videos available</div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-center text-white">
        <i 
          onClick={handlePreviousPage} 
          className={`fa-solid fa-arrow-left p-2 cursor-pointer ${page === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-white'}`}
          disabled={page === 1}
        ></i>
        <p className='mx-6'>{page}</p>
        <i 
          onClick={handleNextPage} 
          className={`fa-solid fa-arrow-right p-2 cursor-pointer ${page === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-white'}`}
          disabled={page === totalPages}
        ></i>
      </div>

      <ShowPlaylists
        isOpen={addPlaylistBox}
        onClose={() => setAddPlaylistBox(false)}
        userPlaylistData={userPlaylistData}
        onAddToPlaylist={addVideoToPlaylist}
        onCreatePlaylist={() => setCreatePLaylistBox(true)}
        selectedVideo={selectedVideo}
      />

      <CreatePlaylist
        isOpen={createPlaylistBox}
        onClose={()=>setCreatePLaylistBox(false)}
        isLoading={createLoading}
        onSubmit={createPlaylist}
      />
       {error!==null && <ErrorDisplay errorMessage={error} onClose={()=>setError(null)}/>}
    </div>
  );
};

export default AllVideos;
