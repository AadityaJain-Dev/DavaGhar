import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Define interfaces for component data
interface Supplier {
  name: string;
  drug_licence_number: string;
  address: string;
}

interface CompanyData {
  name: string;
  parent_name?: string;
  suppliers?: Supplier[];
}

interface SupplierInfoProps {
  companySlug?: string;
}

const SupplierInfo = ({ companySlug = '' }: SupplierInfoProps) => {
    const [companyData, setCompanyData] = useState<CompanyData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch company data when slug changes
    useEffect(() => {
        if (!companySlug) return;

        const fetchSuppliersData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`/api/company/${companySlug}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch company data');
                }
                const data = await response.json();
                setCompanyData(data);
            } catch (error) {
                console.error('Error fetching company data:', error);
                setError('Failed to load company information. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliersData();
    }, [companySlug]);

    if (!companySlug && !companyData) {
        return null; // Don't render anything if no slug is provided yet
    }

    return (
        <>
            {loading && (
                <div className="mt-8 p-4 bg-white rounded-lg shadow-lg w-full">
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-8 p-4 bg-white rounded-lg shadow-lg w-full">
                    <div className="text-red-500 text-center">{error}</div>
                </div>
            )}

            {companyData && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl mt-8 p-6 bg-white rounded-lg shadow-lg w-full"
                >
                    <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{companyData.name}</h2>
                            {!!companyData.parent_name && <p className="text-gray-500">Parent: {companyData.parent_name}</p>}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Suppliers</h3>
                        <div className="space-y-4">
                            {companyData.suppliers && companyData.suppliers.map((supplier: Supplier, index: number) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium text-gray-800">{supplier.name}</h4>
                                        <span className="text-sm text-gray-500">DL: {supplier.drug_licence_number}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">Address: {supplier.address}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default SupplierInfo;