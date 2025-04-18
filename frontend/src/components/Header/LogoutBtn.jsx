import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { persistor } from '../../store/store';
import ErrorDisplay from '../util/ErrorDisplay';

function LogoutBtn({ className = '' }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleLogout = async () => {
        try {
            const response = await axios.post('/api/v1/user/logout');

            if (response.status === 200) {
                dispatch(logout());

                localStorage.clear();
                await persistor.purge();

                navigate('/');
            }
        } catch (error) {
            console.error('Logout failed:', error.response ? error.response.data : error.message);
            setError(error.response?.data?.message || "Unable to logout, please try again after some time!")
        }
    };

    return (
        <div className={`text-white cursor-pointer ${className}`} onClick={handleLogout}>
            LogOut
        </div>
    );
}

export default LogoutBtn;
