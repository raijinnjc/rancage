import React from 'react';
import { cn } from '../../utils/cn.ts';

interface KujangLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function KujangLogo({ size = 32, className, ...props }: KujangLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('transition-all duration-300', className)}
      {...props}
    >
      {/* Modern, stylized Kujang representation */}
      <path
        d="M50 15C50 15 65 30 75 50C85 70 80 90 80 90C80 90 60 85 45 75C30 65 20 45 20 45C20 45 25 50 35 55C45 60 55 55 55 55C55 55 50 40 40 30C30 20 25 15 25 15C25 15 40 10 50 15Z"
        fill="currentColor"
      />
      {/* Holes/dots typical in Kujang */}
      <circle cx="45" cy="40" r="3" fill="var(--bg-white, #fff)" />
      <circle cx="52" cy="48" r="3" fill="var(--bg-white, #fff)" />
      <circle cx="58" cy="58" r="3" fill="var(--bg-white, #fff)" />
    </svg>
  );
}
