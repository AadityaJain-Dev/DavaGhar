import { useState } from 'react';

import SearchBox from "./components/search-box/index";
import ResultBox from "./components/result-box/index";
import SupplierInfo from "./components/supplier-info/index";
import HeroBox from "./components/hero-box/index";
import HighlightBox from "./components/highlights-box/index";
import PopularCategoriesBox from "./components/popular-categories/index";
import ProjectUpdateBox from "./components/project-updates/index";
import FooterBox from "./components/footer-box/index";

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
    <div className="bg-gradient-to-b from-sky-300 to-sky-200 min-h-screen">
      <div className="min-h-screen w-screen flex flex-col items-center py-8 px-4">


        <HeroBox />
        <div className="relative w-full max-w-4xl flex flex-col items-center">
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

        <HighlightBox />
        <PopularCategoriesBox />

        <div className="w-full max-w-4xl">
          <ProjectUpdateBox />
          <FooterBox />
        </div>
      </div>
    </div>
  );
};

export default App;