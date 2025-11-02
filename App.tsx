
import React, { useState, useCallback } from 'react';
import './types'; // Import for side-effects (attaching types to global)
import Header from './components/Header';
import ProblemDisplay from './components/ProblemDisplay';
import { generateMathProblem } from './services/geminiService';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('integral calculus');
  const [problem, setProblem] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const popularTopics = [
    'Linear Algebra',
    'Derivatives',
    'Integral Calculus',
    'Differential Equations',
    'Probability',
    'Trigonometry',
  ];

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setProblem('');

    try {
      const generatedProblem = await generateMathProblem(topic);
      if (generatedProblem.startsWith('Sorry')) {
          setError(generatedProblem);
          setProblem('');
      } else {
          setProblem(generatedProblem);
      }
    } catch (e: any) {
      setError('An unexpected error occurred. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [topic]);
  
  const handleTopicClick = (selectedTopic: string) => {
    setTopic(selectedTopic);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
          
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter a Math Topic
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                placeholder="e.g., quadratic equations"
                className="flex-grow w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
                disabled={isLoading}
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate Problem'
                )}
              </button>
            </div>
          </div>

          <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Or try one of these:</p>
              <div className="flex flex-wrap gap-2">
                  {popularTopics.map(t => (
                      <button key={t} onClick={() => handleTopicClick(t)} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                          {t}
                      </button>
                  ))}
              </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 min-h-[150px] flex items-center justify-center">
            {isLoading && (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p>Generating your math problem...</p>
                <p className="text-sm mt-1">This may take a moment.</p>
              </div>
            )}
            {error && (
              <div className="text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-4 rounded-md w-full">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}
            {!isLoading && !error && problem && (
              <div className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <ProblemDisplay content={problem} />
              </div>
            )}
            {!isLoading && !error && !problem && (
              <div className="text-center text-gray-400 dark:text-gray-500">
                <p>Your generated problem will appear here.</p>
              </div>
            )}
          </div>
        </div>
        <footer className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
            <p>Powered by Gemini and KaTeX</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
