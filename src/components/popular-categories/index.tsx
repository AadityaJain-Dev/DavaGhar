const PopularCategories = () => {
    return (
        <>
            <div className="w-full max-w-4xl mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="#" className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
                        <svg className="w-10 h-10 text-black mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                        </svg>
                        <span className="font-medium text-black">Pharmaceuticals</span>
                    </a>
                    <a href="#" className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
                        <svg className="w-10 h-10 text-black mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m-6-8h6M9 5a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6z"></path>
                        </svg>
                        <span className="font-medium text-black">Generic Medicines</span>
                    </a>
                    <a href="#" className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
                        <svg className="w-10 h-10 text-black mb-2" fill="#000000" viewBox="0 0 50 50" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" overflow="inherit"><path d="M25 21.473c2.804 0 5.158 1.9 5.823 4.469.836 3.221.723 6.751 4.398 8.584 3.262 1.11 4.496 2.505 4.496 6.245 0 2.985-2.554 6.158-5.847 6.554-3.682.553-6.548-.17-8.871-1.494-2.323 1.324-5.19 2.048-8.867 1.494-3.295-.396-5.848-3.58-5.848-6.554 0-3.66 1.317-5.209 4.573-6.27 4.007-2.047 3.469-5.635 4.363-8.717.723-2.49 3.037-4.311 5.78-4.311zm18.357-2.224c-.993-.863-5.046 2.506-6.321 4.172-.775.889-1.257 2.111-1.257 3.459 0 2.711 1.94 4.909 4.327 4.909 1.816 0 3.37-1.263 4.013-3.059 1.249-3.23 1.318-7.675-.762-9.481zm-36.716 0c-2.077 1.806-2.01 6.251-.759 9.481.643 1.796 2.196 3.059 4.011 3.059 2.389 0 4.327-2.198 4.327-4.909 0-1.348-.481-2.57-1.256-3.459-1.276-1.666-5.328-5.035-6.323-4.172zm23.694-17.707c10.088 1.712 9.38 18.702 1.303 17.333-2.33-.396-4.06-2.518-4.323-5.053-.267-2.578-.868-12.938 3.02-12.28zm-10.67 0c3.889-.659 3.287 9.701 3.02 12.279-.263 2.536-1.991 4.657-4.321 5.053-8.079 1.371-8.786-15.62 1.301-17.332z" /></svg>
                        <span className="font-medium text-black">Pet Medicines</span>
                    </a>
                    <a href="#" className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
                        <svg className="w-10 h-10 text-black mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                        <span className="font-medium text-black">Diagnostic Equipment</span>
                    </a>
                </div>
            </div>
        </>
    );
};

export default PopularCategories;