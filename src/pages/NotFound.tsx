const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-black flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Sad Face Icon matching standard 404 error graphic */}
        <div className="mb-6 text-gray-400 dark:text-gray-500">
          <svg
            className="w-32 h-32 md:w-40 md:h-40 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
            <circle cx="9" cy="9" r="1" fill="currentColor" />
            <circle cx="15" cy="9" r="1" fill="currentColor" />
            <path
              d="M16 16c-.8-1.5-2.2-2.5-4-2.5s-3.2 1-4 2.5"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* 404 Heading */}
        <h1 className="text-6xl md:text-7xl font-light tracking-tight text-gray-600 dark:text-gray-300 mb-2 font-sans">
          404
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl font-normal text-gray-500 dark:text-gray-400 mb-6 font-sans">
          Page not found
        </h2>

        {/* Error Details */}
        <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500 leading-relaxed font-sans max-w-sm">
          The Page you are looking for doesn't exist or an other error occurred.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
