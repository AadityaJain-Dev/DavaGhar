import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define interfaces for your component's props and data structures
interface CompanyData {
  name: string;
  slug: string;
  isLoading?: boolean;
  isTooShort?: boolean;
}

interface ResultBoxProps {
  companyData?: CompanyData[];
  searchTerm?: string;
  showResults?: boolean;
  setShowResults: (show: boolean) => void;
  onCompanySelect: (slug: string) => void;
}

const ResultBox = ({ 
  companyData = [], 
  searchTerm = '', 
  showResults = false, 
  setShowResults, 
  onCompanySelect 
}: ResultBoxProps) => {
    const [resultData, setResultData] = useState<CompanyData[]>([]);
    const [titleText, setTitleText] = useState('Most Searched');
    const [isLoading, setIsLoading] = useState(false);
    const [isTooShort, setIsTooShort] = useState(false);

    const fetchTopSearches = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/top-5');
            const data = await response.json();
            // Ensure data is an array
            setResultData(Array.isArray(data) ? data : []);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching top searches:', error);
            setResultData([]);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.length < 3) {
            // Fetch top searches when component mounts
            fetchTopSearches();
            setTitleText('Most Searched');
            setIsTooShort(searchTerm.length > 0);
        } else {
            // Check if we have a loading state
            if (companyData.length === 1 && companyData[0].isLoading) {
                setIsLoading(true);
                setIsTooShort(false);
                setTitleText(`Searching for: ${searchTerm}`);
                setResultData([]);
            } else if (companyData.length === 1 && companyData[0].isTooShort) {
                setIsLoading(false);
                setIsTooShort(true);
                setTitleText(`Search Results for: ${searchTerm}`);
                setResultData([]);
            } else {
                setIsLoading(false);
                setIsTooShort(false);
                // Ensure companyData is an array
                setResultData(Array.isArray(companyData) ? companyData : []);
                setTitleText(`Search Results for: ${searchTerm}`);
            }
        }
    }, [searchTerm, companyData]);

    // Handle suggestion click
    const handleSuggestionClick = (slug: string) => {
        onCompanySelect(slug);
        setShowResults(false);
    };

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                !e.target ||
                !(e.target as Element).closest('.search-results') && 
                !(e.target as Element).closest('input[type="search"]') &&
                !(e.target as Element).closest('button[type="submit"]')
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowResults]);

    // Render content based on state
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
                </div>
            );
        }

        if (isTooShort) {
            return (
                <div className="p-4 text-center text-gray-600">
                    Please enter at least 3 characters to search
                </div>
            );
        }

        // Check if resultData is an array and has length
        if (!Array.isArray(resultData)) {
            console.error('resultData is not an array:', resultData);
            return (
                <div className="p-4 text-center text-gray-600">
                    Error loading results
                </div>
            );
        }

        if (searchTerm.length >= 3 && resultData.length === 0) {
            return (
                <div className="p-4 text-center text-gray-600">
                    No results found for "{searchTerm}"
                </div>
            );
        }

        return (
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
        );
    };

    return (
        <>
            <AnimatePresence>
                {showResults && (
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
                            {renderContent()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ResultBox;