import React from 'react';
import { cn } from '../../utils/cn.ts';

interface MegaMendungPatternProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  fill?: string;
}

export function MegaMendungPattern({ className, fill = 'currentColor', ...props }: MegaMendungPatternProps) {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('absolute inset-0 z-0 pointer-events-none opacity-5', className)}
      {...props}
    >
      <defs>
        <pattern id="megamendung" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <g fill={fill}>
            <path d="M 10 60 Q 25 40 40 60 Q 55 80 70 60 Q 85 40 100 60 Q 115 80 130 60 L 130 120 L -10 120 Z" opacity="0.4" />
            <path d="M 0 70 Q 20 45 40 70 Q 60 95 80 70 Q 100 45 120 70 L 120 120 L 0 120 Z" opacity="0.6" />
            <path d="M -10 80 Q 15 50 40 80 Q 65 110 90 80 Q 115 50 140 80 L 140 120 L -10 120 Z" opacity="0.8" />
            
            <path d="M 60 20 Q 75 0 90 20 Q 105 40 120 20 Q 135 0 150 20 L 150 120 L 60 120 Z" opacity="0.3" />
            <path d="M 50 30 Q 70 5 90 30 Q 110 55 130 30 Q 150 5 170 30 L 170 120 L 50 120 Z" opacity="0.5" />
            
            <path d="M -40 20 Q -25 0 -10 20 Q 5 40 20 20 Q 35 0 50 20 L 50 120 L -40 120 Z" opacity="0.3" />
            <path d="M -50 30 Q -30 5 -10 30 Q 10 55 30 30 Q 50 5 70 30 L 70 120 L -50 120 Z" opacity="0.5" />
          </g>
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#megamendung)" />
    </svg>
  );
}
