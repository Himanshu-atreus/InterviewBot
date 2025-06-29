import React from 'react';
import Image from 'next/image';

function InterviewHeader() {
  return (
    <header className="bg-gray-900 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex justify-center">
        <Image 
          src="/rico.png" 
          alt="Rico Logo"
          width={180}
          height={60}
          className="w-[180px] sm:w-[200px] h-auto object-contain"
          priority
        />
      </div>
    </header>
  );
}

export default InterviewHeader;
