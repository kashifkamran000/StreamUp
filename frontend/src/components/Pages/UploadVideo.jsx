import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../util/Input';
import Button from '../util/Button';
import Uploading from '../util/Loadings/Uploading'
import UploadDone from '../util/Loadings/UploadDone'
import ErrorDisplay from '../util/ErrorDisplay';

function UploadVideo() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [finalAnimation, setFinalAnimation] = useState(false);

    const uploadVideo = async (data) => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('thumbnail', data.thumbnail[0]);
        formData.append('video', data.videoFile[0]);

        try {
            const response = await axios.post('/api/v1/video/upload-video', formData, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                reset();
                setLoading(false);
                setFinalAnimation(true);
                setTimeout(() => {
                    setFinalAnimation(false);
                    navigate('/user-dashboard')}, 2000); 
            }
        } catch (error) {
            console.error("Error while Uploading", error.response?.data, error.response?.status);
            setError(error.response?.data?.message || error.message || "An error occurred while uploading the video");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='text-white w-full h-full grid place-content-center '>
            
            <div className='bg-gray-box rounded-3xl max-w-md md:max-w-[50rem] md:p-12 md:m-20 m-4 my-12 p-8 pt-12 border-2 border-gray-400/10 shadow-inner h-auto overflow-hidden relative'>
            {loading && <div className='w-full h-full absolute bg-black/20 top-0 left-0 grid place-content-center'><Uploading/></div>}
            {finalAnimation && <div className='w-full h-full absolute bg-black/40 top-0 left-0 grid place-content-center'><UploadDone/></div>}
                <h1 className='text-2xl md:text-3xl mb-10'>Publish Video</h1>
                
                <form onSubmit={handleSubmit(uploadVideo)} className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='col-span-2 md:col-span-1'>
                        <Input
                            label='Title:'
                            className='bg-gray-box focus:bg-gray-box focus:border-none border-none text-white mb-8'
                            placeholder='Enter video title'
                            {...register('title', { required: 'Title is required' })}
                            error={errors.title?.message}
                            labelClassName="text-white"
                            onFocus={(e) => { e.target.style.backgroundColor = "#18181B"}}
                        />
                        <Input
                            className='bg-gray-box focus:bg-gray-box focus:border-none border-none text-white mb-8'
                            label='Description:'
                            placeholder='Enter video description'
                            {...register('description', { required: 'Description is required' })}
                            error={errors.description?.message}
                            labelClassName="text-white"
                            onFocus={(e) => { e.target.style.backgroundColor = "#18181B"}}
                        />
                    </div>
                    <div className='col-span-2 md:col-span-1'>
                        <Input
                            className='bg-gray-box focus:bg-gray-box focus:border-none border-none text-white mb-8'
                            label='Thumbnail:'
                            type="file"
                            accept="image/*"
                            {...register('thumbnail', { required: 'Thumbnail is required' })}
                            error={errors.thumbnail?.message}
                            labelClassName="text-white"
                            onFocus={(e) => { e.target.style.backgroundColor = "#18181B"}}
                        />
                        <Input
                            className='bg-gray-box focus:bg-gray-box focus:border-none border-none text-white mb-8'
                            label='Video File:'
                            type="file"
                            accept="video/*"
                            {...register('videoFile', { required: 'Video file is required' })}
                            error={errors.videoFile?.message}
                            labelClassName="text-white"
                            onFocus={(e) => { e.target.style.backgroundColor = "#18181B"}}
                        />
                    </div>


                    {error && (
                        <div className="col-span-2 mb-4 text-red-500">
                            <p className="text-center">{error}</p>
                        </div>
                    )}

                    <Button 
                        children={loading ? 'Uploading...' : 'Publish'} 
                        className='col-span-2 w-full md:w-1/3' 
                        type='submit'
                        disabled={loading}
                    />
                </form>
            </div>
            {error!==null && <ErrorDisplay errorMessage={error} onClose={()=>setError(null)}/>}
        </div>
    );
}

export default UploadVideo;
