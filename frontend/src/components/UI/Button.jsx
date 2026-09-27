import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Enhanced Button Component
 * Supports 6 variants, 5 sizes, icon placement, loading states, and touch accessibility.
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  fullWidth = false,
  className = '',
  ...props
}) => {
  // Base styling: accessible min height, font weight, smooth transitions
  const baseStyles = 'inline-flex items-center justify-center font-bold font-sans rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  // 6 Variants with Olive-Greenish Agri Palette
  const variants = {
    primary: 'bg-[#4A4A2E] hover:bg-[#363622] text-white shadow-md shadow-[#4A4A2E]/25 hover:shadow-lg focus-visible:ring-[#4A4A2E] border border-transparent',
    secondary: 'bg-[#5C7A3C] hover:bg-[#46602D] text-white shadow-md shadow-[#5C7A3C]/25 hover:shadow-lg focus-visible:ring-[#5C7A3C] border border-transparent',
    accent: 'bg-[#5FA83D] hover:bg-[#48882C] text-white shadow-md shadow-[#5FA83D]/30 hover:shadow-lg focus-visible:ring-[#5FA83D] border border-transparent',
    outline: 'bg-white hover:bg-[#F5F4EE] text-[#4A4A2E] border border-[#D1CDBC] hover:border-[#A8A38E] shadow-xs focus-visible:ring-[#4A4A2E]',
    ghost: 'bg-transparent hover:bg-[#E6EDE0]/70 text-[#4A4A2E] hover:text-[#262619] border border-transparent focus-visible:ring-[#5C7A3C]',
    danger: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-md shadow-red-600/25 hover:shadow-lg focus-visible:ring-red-600 border border-transparent'
  };

  // 5 Sizes with minimum touch targets
  const sizes = {
    xs: 'px-2.5 py-1 text-xs min-h-[30px] gap-1.5',
    sm: 'px-3 py-1.5 text-xs min-h-[36px] gap-1.5',
    md: 'px-4 py-2.5 text-sm min-h-[44px] gap-2',
    lg: 'px-6 py-3 text-base min-h-[48px] gap-2.5',
    xl: 'px-8 py-3.5 text-lg min-h-[54px] gap-3'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${widthStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin shrink-0" size={size === 'xs' || size === 'sm' ? 14 : size === 'lg' || size === 'xl' ? 20 : 16} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className="shrink-0" size={size === 'xs' || size === 'sm' ? 14 : size === 'lg' || size === 'xl' ? 20 : 16} />
          )}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && (
            <Icon className="shrink-0" size={size === 'xs' || size === 'sm' ? 14 : size === 'lg' || size === 'xl' ? 20 : 16} />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
