import React from 'react';

function NoMatch() {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center">
                <div className="text-6xl font-bold text-red-500">404</div>
                <div className="text-2xl mt-2 mb-4 font-medium text-gray-800">Not there yet</div>
                <p className="text-gray-600">Got lost? <a href="/" className="text-blue-500 hover:underline">Home</a>.</p>
            </div>
        </div>
    );
}

export default NoMatch;