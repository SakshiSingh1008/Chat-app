import React from 'react';

function Input({
  label = " ", 
  name = " ", 
  type = "text", 
  className = "", 
  inputClassName = " ", 
  isRequired = true, 
  placeholder = "", 
  value = "", 
  onChange = () => { },
}) {
  return (
    <div className={`${className} mb-6`}> {/* Fixed string interpolation here */}
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-800">
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${inputClassName}`}
        placeholder={placeholder}
        required={isRequired}
        value={value}
        onChange={onChange} 
      />
    </div>
  );
}

export default Input;
