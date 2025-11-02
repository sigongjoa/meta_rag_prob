import React, { useEffect, useRef } from 'react';

interface ProblemDisplayProps {
  content: string;
}

const ProblemDisplay: React.FC<ProblemDisplayProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Always update the raw text content first whenever content changes.
    container.textContent = content;

    const renderMath = () => {
      if (window.renderMathInElement) {
        try {
          window.renderMathInElement(container, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\(', right: '\\)', display: false },
              { left: '\\[', right: '\\]', display: true },
            ],
            throwOnError: false,
          });
        } catch (error) {
          console.error("KaTeX rendering error:", error);
        }
      }
    };

    const handleKatexReady = () => {
      renderMath();
    };

    // If KaTeX is ready, render immediately.
    if (window.renderMathInElement) {
      renderMath();
    } else {
      // Otherwise, wait for our custom event.
      document.body.addEventListener('katex-ready', handleKatexReady);
    }

    // Cleanup function to remove the event listener.
    return () => {
      document.body.removeEventListener('katex-ready', handleKatexReady);
    };
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed prose prose-lg dark:prose-invert max-w-none"
    >
      {/* Content is set via useEffect to prevent race conditions */}
    </div>
  );
};

export default ProblemDisplay;