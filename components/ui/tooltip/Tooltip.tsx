"use client"
import { useRouter } from 'next/navigation';
import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
  href?:string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, className, href }) => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  return (
    <span
      onClick={() => {
        if (href) {
          router.push(href);
        }
      }}
      className={"relative inline-block " + (className || "")}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      tabIndex={0}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs whitespace-nowrap shadow-lg">
          {content}
        </span>
      )}
    </span>
  );
};

export default Tooltip; 