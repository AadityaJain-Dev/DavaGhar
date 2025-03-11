import { useRef, ChangeEvent, FormEvent } from 'react';
import { CompanyData } from '../../types/types';

interface SearchBoxProps {
  setCompanyData: (data: CompanyData[]) => void;
  setSearchTerm: (term: string) => void;
  searchTerm?: string;
  setShowResults: (show: boolean) => void;
}

const SearchBox = ({ 
  setCompanyData, 
  setSearchTerm, 
  searchTerm = '', 
  setShowResults 
}: SearchBoxProps) => {
    // Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
                        className="block w-full p-4 ps-10 text-xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            </form>
        </>
    );
};

export default SearchBox;