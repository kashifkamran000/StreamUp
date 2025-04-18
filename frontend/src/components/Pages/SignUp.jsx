import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../util/Input'
import Loading from '../util/Loadings/Loading';
import axios from 'axios';
import Button from '../util/Button';
import {motion} from 'framer-motion'
import Lottie from 'lottie-react';
import Signup from '../../assets/Signup.json'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import ErrorDisplay from '../util/ErrorDisplay';


function SignUp() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {register, handleSubmit, formState: {errors}, reset} = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const onSubmit = async (data)=>{
        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append('fullName', data.fullName);
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('avatar', data.avatar[0]);
        if (data.coverImage[0]) {
            formData.append('coverImage', data.coverImage[0]);
          }

        try {
            const response = await axios.post('/api/v1/user/register', formData, {
                headers:{
                    'Content-Type' : 'multipart/form-data', 
                }
            })
            if(response.status === 200){
                reset();
                dispatch(login(response.data.data))
                navigate('/videos');
            }
           

        } catch (error) {
            console.error('Signup failed', error.response.data);
            setError(error.response?.data?.message || error.message || 'Unable to Register, please try again');
        }finally{
            setLoading(false);
        }

      
    }


    return(
        <div className='relative h-[75rem] w-full '>
            <div className='absolute z-10 w-1/2 h-full grid place-content-center'>
                <div className=' w-6/7 p-10 bg-gray-box rounded-xl border-2  border-gray-400/10 shadow-3xl '>

                <p className='text-white text-3xl text-center mb-8 font-medium'>Create Your Account</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                            <Input
                            label="Full Name"
                            {...register('fullName', { required: 'Full Name is required' })}
                            error={errors.fullName?.message}
                            labelClassName="text-white"
                            />
                            <Input
                            label="Username"
                            {...register('username', { required: 'Username is required' })}
                            error={errors.username?.message}
                            labelClassName="text-white"
                            />
                            <Input
                            label="Email"
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            error={errors.email?.message}
                            labelClassName="text-white"
                            />
                            <Input
                            label="Password"
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            error={errors.password?.message}
                            labelClassName="text-white"
                            />
                            <Input
                            label="Avatar"
                            type="file"
                            {...register('avatar',  {required: 'Avatar is required'})}
                            error={errors.avatar?.message}
                            labelClassName="text-white"
                            />
                            <Input
                            label="Cover Image"
                            type="file"
                            {...register('coverImage',)}
                            labelClassName="text-white"
                            />
                            <Button type="submit" disabled={loading} children={loading ? "Signing Up..." : "Sign Up"} / >
                    </form>
                    {loading && <Loading/>}
                    <Link to='/login'><p className='text-white text-center mt-7'>Already Having Account? Login</p></Link>
                    
                </div> 
            </div>
            <motion.div initial={{width: "100%", x: 0}} animate={{width: "50%", x: 945}} transition={{ duration: 0.5, stiffness: 100, damping: 13,  delay:2.5, type: "spring" }} className='absolute z-20  bg-background-all w-full h-full grid place-content-center  rounded-xl border-l-8 border-hopbush-main/50'>
            <Lottie
                animationData={Signup}
                loop={true}
                autoplay={true}
                style={{ width: 400, height: 400 }}
             />
            </motion.div>
            {error!==null && <ErrorDisplay errorMessage={error} onClose={()=>setError(null)}/>}
        </div>
    )
}


export default SignUp