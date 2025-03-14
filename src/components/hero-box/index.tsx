const HeroBox = () => {
    return (
        <>
            <header className="w-full max-w-4xl flex flex-col items-center mb-8">
                <div className="flex items-center mb-2">
                    <svg className="size-16 md:size-20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <g data-name="6. Smartphone Drug" id="_6._Smartphone_Drug">
                            <path className="cls-1" d="M18.21,32H7.79A4.8,4.8,0,0,1,3,27.21V4.79A4.8,4.8,0,0,1,7.79,0H18.21A4.8,4.8,0,0,1,23,4.79V5a1,1,0,0,1-2,0V4.79A2.79,2.79,0,0,0,18.21,2H7.79A2.79,2.79,0,0,0,5,4.79V27.21A2.79,2.79,0,0,0,7.79,30H18.21A2.79,2.79,0,0,0,21,27.21V25a1,1,0,0,1,2,0v2.21A4.8,4.8,0,0,1,18.21,32Z"></path>
                            <path className="cls-2" d="M13,28a2,2,0,1,1,2-2A2,2,0,0,1,13,28Zm0-2Z"></path>
                            <path className="cls-1" d="M16,6H10a1,1,0,0,1,0-2h6a1,1,0,0,1,0,2Z"></path>
                            <path className="cls-1" d="M29,12.53a4.53,4.53,0,0,0-7.74-3.2l-4.93,4.93A4.54,4.54,0,0,0,19.53,22h0a4.49,4.49,0,0,0,3.2-1.33l2.46-2.46h0l2.46-2.46A4.47,4.47,0,0,0,29,12.53Zm-7.67,6.73a2.52,2.52,0,0,1-1.79.74h0A2.53,2.53,0,0,1,17,17.46a2.56,2.56,0,0,1,.74-1.79l1.76-1.76,3.59,3.59ZM27,12.54a2.56,2.56,0,0,1-.74,1.79L24.5,16.09,20.91,12.5l1.76-1.76A2.54,2.54,0,0,1,27,12.53Z"></path>
                        </g>
                    </svg>
                    <h1 className="text-3xl md:text-4xl font-bold ml-3 text-gray-800">Dava Ghar</h1>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-700 text-center">Connecting Indore consumers with wholesale suppliers</h2>
                <p className="text-lg font-medium italic text-gray-700 text-center mt-2">Eliminate retail margins by finding bulk suppliers directly</p>
            </header>
        </>
    );
};

export default HeroBox;