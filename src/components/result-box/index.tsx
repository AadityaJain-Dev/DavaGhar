import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ResultBox = ({ companyData = [], searchTerm = '', showResults, setShowResults, onCompanySelect }) => {
    const [resultData, setResultData] = useState([]);
    const [titleText, setTitleText] = useState('Most Searched');

    const fetchTopSearches = async () => {
        try {
            const response = await fetch('/api/top-5');
            const data = await response.json();
            setResultData(data);
        } catch (error) {
            console.error('Error fetching top searches:', error);
        }
    };

    useEffect(() => {
        if (searchTerm.length < 3) {
            // Fetch top searches when component mounts
            fetchTopSearches();
            setTitleText('Most Searched');
        } else {
            setResultData(companyData);
            setTitleText(`Search Results for: ${searchTerm}`);
        }
    }, [searchTerm, companyData]);

    // Handle suggestion click
    const handleSuggestionClick = (slug) => {
        onCompanySelect(slug);
        setShowResults(false);
    };

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                !e.target.closest('.search-results') && 
                !e.target.closest('input[type="search"]') &&
                !e.target.closest('button[type="submit"]')
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowResults]);

    return (
        <>
            <AnimatePresence>
                {showResults && resultData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute w-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-10 search-results"
                        style={{ width: '100%' }}
                    >
                        <div className="p-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">{titleText}</h3>
                            <ul className="space-y-2">
                                {resultData.map((item, index) => (
                                    <li
                                        key={`top-${index}`}
                                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors duration-200"
                                        onClick={() => handleSuggestionClick(item.slug)}
                                    >
                                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                        <span className="text-gray-700">{item.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ResultBox;