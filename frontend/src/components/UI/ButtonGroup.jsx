import React from 'react';

/**
 * ButtonGroup Component
 * Prevents button overlapping, manages intelligent responsive spacing,
 * and maintains proper touch targets across mobile and desktop.
 */
const ButtonGroup = ({
  children,
  direction = 'horizontal',
  spacing = 'md',
  align = 'start',
  fullWidth = false,
  responsive = true,
  className = '',
  ...props
}) => {
  // Spacing scales
  const spacingMap = {
    xs: 'gap-1.5',
    sm: 'gap-2.5',
    md: 'gap-3.5',
    lg: 'gap-5',
    xl: 'gap-6'
  };

  // Alignment options
  const alignMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  // Responsive vs strict directional styles
  const layoutStyles = responsive
    ? direction === 'horizontal'
      ? 'flex flex-col sm:flex-row sm:items-center'
      : 'flex flex-col'
    : direction === 'horizontal'
      ? 'flex flex-row items-center flex-wrap'
      : 'flex flex-col';

  const widthStyles = fullWidth ? 'w-full [&>*]:flex-1' : '';

  return (
    <div
      className={`w-full ${layoutStyles} ${spacingMap[spacing] || spacingMap.md} ${alignMap[align] || alignMap.start} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default ButtonGroup;
