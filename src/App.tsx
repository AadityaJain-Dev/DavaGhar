import { useState } from 'react';

import SearchBox from "./components/search-box/index";
import ResultBox from "./components/result-box/index";
import SupplierInfo from "./components/supplier-info/index";

const App = () => {
  const [companyData, setCompanyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedCompanySlug, setSelectedCompanySlug] = useState('');

  const handleCompanySelect = (slug: string) => {
    setSelectedCompanySlug(slug);
    setSearchTerm(''); // Optionally clear search term after selection
  };

  return (
    <div className="h-screen w-screen bg-sky-300 flex items-center justify-center">
      <div className="w-full max-w-2xl px-4 flex flex-col items-center">
        <div className="w-full relative">
          <SearchBox 
            setCompanyData={setCompanyData} 
            setSearchTerm={setSearchTerm} 
            searchTerm={searchTerm} 
            setShowResults={setShowResults} 
          />

          <ResultBox 
            companyData={companyData} 
            searchTerm={searchTerm} 
            showResults={showResults}
            setShowResults={setShowResults}
            onCompanySelect={handleCompanySelect}
          />
        </div>

        <SupplierInfo companySlug={selectedCompanySlug} />
      </div>
    </div>
  );
};

export default App;