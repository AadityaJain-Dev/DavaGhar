import { useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { CompanyData } from '../../types/types';

interface SearchBoxProps {
    setCompanyData: (data: CompanyData[]) => void;
    setSearchTerm: (term: string) => void;
    searchTerm?: string;
    setShowResults: (show: boolean) => void;
    setCaptchaToken: (token: string) => void;
}

declare global {
    interface Window {
        turnstileCallback?: (token: string) => void;
        turnstile?: {
            render: (token: string, options: any) => void;
        };
    }
}

const SearchBox = ({
    setCompanyData,
    setSearchTerm,
    searchTerm = '',
    setShowResults,
    setCaptchaToken
}: SearchBoxProps) => {
    // Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
    // Define the callback function for Turnstile
    window.turnstileCallback = (token) => {
      setCaptchaToken(token);
    };
    
    // Function to load and render Turnstile
    const loadAndRenderTurnstile = () => {
      // Check if script already exists
      if (!document.querySelector('script[src*="turnstile/v0/api.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        script.onload = renderTurnstile;
        script.onerror = () => {
          console.error('Failed to load Turnstile script');
          // Retry after a short delay
          setTimeout(loadAndRenderTurnstile, 2000);
        };
        document.head.appendChild(script);
      } else if (window.turnstile) {
        // If script exists but widget hasn't rendered, try to render it
        renderTurnstile();
      }
    };
    
    // Function to render the Turnstile widget
    const renderTurnstile = () => {
      // Clear any existing widgets in the container
      const container = document.getElementById('turnstile-container');
      if (container) {
        container.innerHTML = '';
        
        if (window.turnstile) {
          try {
            window.turnstile.render('#turnstile-container', {
              sitekey: '0x4AAAAAABAZpQVAuI9hXJBC',
              callback: 'turnstileCallback',
              'refresh-expired': 'auto'
            });
          } catch (error) {
            console.error('Error rendering Turnstile:', error);
          }
        }
      }
    };
    
    // Start the loading process
    loadAndRenderTurnstile();
    
    // Add a visibility change listener to handle cases where the page was hidden
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Make sure Turnstile is rendered when page becomes visible again
        setTimeout(renderTurnstile, 500);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      delete window.turnstileCallback;
    };
  }, [setCaptchaToken]);

    // Fetch typeahead results
    const fetchTypeaheadResults = async (query: string): Promise<CompanyData[]> => {
        try {
            const response = await fetch(`/api/typeahead?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            // Ensure we return an array
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching typeahead results:', error);
            return [];
        }
    };

    const searchCompany = (e: ChangeEvent<HTMLInputElement>) => {
        const searchedTerm = String(e.target.value).trim();
        setSearchTerm(searchedTerm);

        // Show results box immediately, even if empty
        setShowResults(true);

        // Clear previous timeout
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // add debounce logic, time should be 750ms
        if (searchedTerm.length > 2) {
            // Update company data with loading state first
            setCompanyData([{ isLoading: true }]);

            debounceTimeout.current = setTimeout(() => {
                fetchTypeaheadResults(searchedTerm)
                    .then((data) => {
                        // Ensure data is an array
                        setCompanyData(Array.isArray(data) ? data : []);
                    })
                    .catch((error) => {
                        console.log('typeahead api error ', error);
                        setCompanyData([]);
                    });
            }, 750);
        } else if (searchedTerm.length <= 2 && searchedTerm.length > 0) {
            // When search term is too short but not empty
            setCompanyData([{ isTooShort: true }]);
        } else {
            // Empty search term
            setCompanyData([]);
        }
    };

    // Handle input focus
    const handleFocus = () => {
        setShowResults(true);
    };

    return (
        <>
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
                <form onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}>
                    <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            onChange={searchCompany}
                            onFocus={handleFocus}
                            value={searchTerm}
                            id="search"
                            className="block w-full p-4 ps-10 text-xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search Manufacturers"
                            autoComplete="off"
                        />

                        <button
                            type="submit"
                            className="absolute top-0 end-0 p-2.5 h-full text-lg font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 pl-5"
                        >
                            Search
                        </button>
                    </div>

                    <div className="flex justify-center mt-4">
                        <div 
                        id="turnstile-container" 
                        className="cf-turnstile w-full flex justify-center my-4"
                        style={{ minHeight: '65px' }}
                        data-sitekey="0x4AAAAAABAZpQVAuI9hXJBC"
                        data-callback="turnstileCallback"
                        data-theme="light"
                        ></div>
                    </div>

                </form>
            </div>
        </>
    );
};

export default SearchBox;