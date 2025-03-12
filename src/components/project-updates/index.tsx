const ProjectUpdates = () => {
    return (
        <>
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h4 className="text-lg font-bold text-gray-800">Project Updates</h4>
                </div>
                <p className="text-gray-700">This is an ongoing project. We add new suppliers every weekend to expand our database and improve your search results.</p>
            </div>
        </>
    );
};

export default ProjectUpdates;