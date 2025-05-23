import React, { useState, ChangeEvent, useEffect } from 'react';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  className?: string;
  debounceTime?: number;
}

const Search: React.FC<SearchProps> = ({
  onSearch,
  placeholder = 'Search...',
  className = '',
  debounceTime = 300
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceTime);
    
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch, debounceTime]);
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className={`search-container ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Search;