import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset'; // ✅ Supports form use
  variant?: 'success' | 'danger' | 'default';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = 'button',
  variant = 'default',
  disabled = false,
}) => {
  const getClassName = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gray-300 hover:bg-gray-400 text-black';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-semibold transition duration-200 ${getClassName()} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {text}
    </button>
  );
};

export default Button;
