import React, { useState, ChangeEvent } from 'react';

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
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Use debounce logic
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, debounceTime);

    // Clear timeout to prevent multiple unnecessary calls
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className={`search-container ${className}`}>
      <input 
        type="text" 
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Search;