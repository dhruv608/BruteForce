"use client";

import React from 'react';
import DOMPurify from 'dompurify';

interface HTMLRendererProps {
  html: string;
  className?: string;
}

export const HTMLRenderer: React.FC<HTMLRendererProps> = ({ html, className = '' }) => {
  // Configure DOMPurify to allow only safe tags
  const cleanHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
    ALLOWED_ATTR: [],
  });

  return (
    <div 
      className={`html-renderer ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
    />
  );
};
