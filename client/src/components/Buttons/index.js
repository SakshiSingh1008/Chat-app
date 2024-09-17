import React from 'react'

const Button = ({
    label="Button",
    type='button',
    className = "",
    disabled = false,

}) => (
  <button
    type="type"
    className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-lg gap-20px
      hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
      disabled:bg-gray-400 disabled:cursor-not-allowed  
      ${className}`}
    disabled={disabled}
  >{label}

  </button>
);
  

export default Button