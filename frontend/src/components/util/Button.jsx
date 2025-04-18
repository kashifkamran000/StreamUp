import React from 'react'
import {motion } from 'framer-motion'

function Button({
    children,
    type = "button",
    className = "",
    disabled = false,
    ...props
}) {
  return (
    <motion.button
        whileHover={{ scale: 1.1, backgroundColor: '#E8228C', color: '#FFFFFF' }}
        whileTap={{ scale: 0.9 }}
        type={type}
        className={` px-4 py-2 rounded-full text-black bg-white min-w-fit ${className}`}
        disabled={disabled}
        style={{ backgroundColor: 'white', color: 'black' }}
        {...props}
    >
        {children}
    </motion.button>
  )
}

export default Button
