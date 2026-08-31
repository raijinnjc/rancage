import React, { useEffect, useState, useRef } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: string;
}

export function PageTransition({ children, pageKey }: PageTransitionProps) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevKeyRef = useRef(pageKey);

  useEffect(() => {
    if (prevKeyRef.current !== pageKey) {
      setIsTransitioning(true);
      
      // Short fade-out, then swap content and fade-in
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsTransitioning(false);
        prevKeyRef.current = pageKey;
        // Scroll to top on page change
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);

      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }
  }, [children, pageKey]);

  return (
    <div
      className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isTransitioning
          ? 'opacity-0 translate-y-2 scale-[0.995]'
          : 'opacity-100 translate-y-0 scale-100'
      }`}
    >
      {displayChildren}
    </div>
  );
}
