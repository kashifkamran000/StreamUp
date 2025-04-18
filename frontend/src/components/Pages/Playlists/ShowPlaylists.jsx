import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ShowPlaylists = ({ 
  isOpen, 
  onClose, 
  userPlaylistData, 
  onAddToPlaylist, 
  onCreatePlaylist,
  selectedVideo 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 text-white'
        >
          <motion.div
            className="bg-gray-box p-10 rounded-xl border-2 border-gray-400/10 w-[35rem] text-white"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-between'>
              <h1 className='text-2xl mb-7 text-white'>All Playlists</h1>
              <i onClick={onCreatePlaylist} className="fa-solid fa-plus text-lg p-1 opacity-75 hover:opacity-100 cursor-pointer"></i>
            </div>
            <ul>
              {userPlaylistData?.length > 0 ? (
                userPlaylistData.map((playlist) => (
                  <motion.li
                    key={playlist._id}
                    initial={{ scale: 1, opacity: 0.8 }}
                    whileHover={{ scale: 1.05, backgroundColor: '#0E0E12', opacity: 1}}
                    className="p-3 cursor-pointer text-sm border-2 border-gray-400/10 rounded-lg bg-gray-box flex justify-between items-center mt-2"
                    onClick={() => {
                        onAddToPlaylist(playlist._id, selectedVideo);
                        onClose(); }}
                  >
                    {playlist.name}
                    <i className="fa-solid fa-plus text-base p-1"></i>
                  </motion.li>
                ))
              ) : (
                <motion.li className="p-3 text-sm text-white/60">
                  No playlists available.
                </motion.li>
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShowPlaylists;