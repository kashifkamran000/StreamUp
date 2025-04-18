import React, { forwardRef, useId } from 'react';

const Input = forwardRef(function Input({
  label,
  className = "",
  labelClassName = "",
  error,
  type = "text",
  ...props
}, ref) {

  const id = useId();
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className={`inline-block mb-4 mt-1 pl-1 font-light ${labelClassName}`}>{label}</label>}
      <input
        type={type}
        ref={ref}
        id={id}
        {...props}
        className={` px-3 py-2 rounded-lg mb-3 bg-gray-100 text-black outline-none w-full duration-200 border focus:bg-hopbush-100  ${error ? 'border-red-500' : 'border-hopbush-300'} ${className} `}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
});

export default Input;
