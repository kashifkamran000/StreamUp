import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import  Input  from '../../util/Input'; 

const CreatePlaylist = ({ isOpen, onClose, onSubmit, isLoading}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const submitForm = (data) => {
    onSubmit(data);
    reset();
  };

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
            className="bg-gray-box p-10 rounded-xl border-2 border-gray-400/10 w-[35rem]"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className='text-2xl mb-7'>Create Playlist</h1>
            <form onSubmit={handleSubmit(submitForm)}>
              <Input
                label='Name'
                {...register('name', { required: 'Name of playlist is required' })}
                error={errors.name?.message}
                labelClassName="text-white"
                className='bg-background-all focus:ring-1 focus:ring-pink-500 focus:ring-offset-0 border-0 text-white'
                style={{ background: '#0E0E12' }}
                placeholder='Name here...'
              />
              <p className='mb-5'>Description</p>
              <textarea
                {...register('description', { required: 'Description is required' })}
                className='rounded-lg bg-background-all resize-none p-4 focus:ring-1 focus:ring-pink-500 focus:ring-offset-0 border-0'
                rows={4}
                cols={55}
                placeholder='Description here...'
                required
              ></textarea>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-white rounded-full text-black p-2 font-normal mt-5'
              >
                {isLoading ? 'Creating...' : 'Create'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePlaylist;