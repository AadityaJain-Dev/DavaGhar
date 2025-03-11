import { useState } from 'react';

import SearchBox from "./components/search-box/index";
import ResultBox from "./components/result-box/index";
import SupplierInfo from "./components/supplier-info/index";
import { CompanyData } from './types/types';

const App = () => {
  // Properly type the state
  const [companyData, setCompanyData] = useState<CompanyData[]>([]);
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

          <div className="flex flex-col items-center justify-center">
            <svg className="size-60 mb-4" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <g data-name="6. Smartphone Drug" id="_6._Smartphone_Drug">
                <path className="cls-1" d="M18.21,32H7.79A4.8,4.8,0,0,1,3,27.21V4.79A4.8,4.8,0,0,1,7.79,0H18.21A4.8,4.8,0,0,1,23,4.79V5a1,1,0,0,1-2,0V4.79A2.79,2.79,0,0,0,18.21,2H7.79A2.79,2.79,0,0,0,5,4.79V27.21A2.79,2.79,0,0,0,7.79,30H18.21A2.79,2.79,0,0,0,21,27.21V25a1,1,0,0,1,2,0v2.21A4.8,4.8,0,0,1,18.21,32Z" />
                <path className="cls-2" d="M13,28a2,2,0,1,1,2-2A2,2,0,0,1,13,28Zm0-2Z" />
                <path className="cls-1" d="M16,6H10a1,1,0,0,1,0-2h6a1,1,0,0,1,0,2Z" />
                <path className="cls-1" d="M29,12.53a4.53,4.53,0,0,0-7.74-3.2l-4.93,4.93A4.54,4.54,0,0,0,19.53,22h0a4.49,4.49,0,0,0,3.2-1.33l2.46-2.46h0l2.46-2.46A4.47,4.47,0,0,0,29,12.53Zm-7.67,6.73a2.52,2.52,0,0,1-1.79.74h0A2.53,2.53,0,0,1,17,17.46a2.56,2.56,0,0,1,.74-1.79l1.76-1.76,3.59,3.59ZM27,12.54a2.56,2.56,0,0,1-.74,1.79L24.5,16.09,20.91,12.5l1.76-1.76A2.54,2.54,0,0,1,27,12.53Z" />
              </g>
            </svg>
          </div>

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

          <div className="flex flex-col mt-6">
            <p className="text-black text-lg font-semibold italic text-center"><i>Eliminate retail margins by finding bulk suppliers directly</i></p>
            <p className="text-black text-center">Note: This is an ongoing project and we add new suppliers on every weekend.</p>
          </div>
          
        </div>

        <SupplierInfo companySlug={selectedCompanySlug} />
      </div>
    </div>
  );
};

export default App;