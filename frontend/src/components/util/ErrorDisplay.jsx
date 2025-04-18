import React, { useEffect } from 'react';
import errorAni from '../../assets/error.json';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';

function ErrorDisplay({ errorMessage, onClose }) {

    useEffect(() => {
        const timer = setTimeout(() => {
          onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }} 
                onClick={onClose} 
            >
                <motion.div
                    className="bg-gray-box p-12 rounded-2xl flex flex-col items-center justify-center text-center"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }} 
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    onClick={(e) => e.stopPropagation()} 
                >
                    <div>
                        <Lottie 
                            animationData={errorAni} 
                            loop={true}
                            autoplay={true}
                            style={{ width: 200, height: 200 }}
                        />
                    </div>
                    <p className='text-white text-center font-thin text-lg mt-4'>{errorMessage}</p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default ErrorDisplay;
