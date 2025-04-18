import React, { useState } from 'react'
import Lottie from 'lottie-react'
import ChangePasswordLogo from '../../assets/ChangePassword.json'
import { useForm } from 'react-hook-form'
import Loading from '../util/Loadings/Loading'
import Input from '../util/Input'
import Button from '../util/Button'
import { useNavigate } from 'react-router-dom'
import qs from 'qs'
import axios from 'axios'
import ErrorDisplay from '../util/ErrorDisplay'

function ChangePassword() {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const changeIt = async (data) => {
        setLoading(true);
        setError(null);
        const formData = qs.stringify({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        });

        try {
            const response = await axios.post('/api/v1/user/change-password', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials: true,
            });
            if (response.status === 200) {
                reset();
                navigate('/profile');
            }
        } catch (error) {
            console.error('Change Password failed:', error.response ? error.response.data : error.message);
            setError(error.response?.data?.message || error.message || 'Unable to change password, please try again!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='text-white w-full flex justify-center items-center my-20 md:my-32'>
            <div className='p-6 bg-gray-box rounded-xl border-2 border-gray-400/10 shadow-3xl w-full max-w-sm sm:max-w-sm lg:max-w-sm md:max-w-sm mx-4'>
                <div className='w-full flex justify-center mb-6'>
                    <Lottie
                        animationData={ChangePasswordLogo}
                        loop={true}
                        autoplay={true}
                        style={{ width: 150, height: 150 }}
                    />
                </div>
                <p className='text-white text-2xl text-center mb-8 font-medium sm:text-3xl'>Change Password</p>

                <form onSubmit={handleSubmit(changeIt)} className="space-y-4 mb-5">
                    <Input
                        label="Old Password"
                        type="password"
                        {...register("oldPassword", { required: 'Old Password is required' })}
                        error={errors.oldPassword?.message}
                        labelClassName="text-white"
                    />
                    <Input
                        label="New Password"
                        type="password"
                        {...register('newPassword', { required: 'New Password is required' })}
                        error={errors.newPassword?.message}
                        labelClassName="text-white"
                    />
                    <Button type="submit" disabled={loading} className='w-full'>
                        {loading ? "Changing Password" : "Change Password"}
                    </Button>
                </form>

                {loading && <Loading />}
            </div>
            {error!==null && <ErrorDisplay errorMessage={error} onClose={()=>setError(null)}/>}
        </div>
    );
}

export default ChangePassword;