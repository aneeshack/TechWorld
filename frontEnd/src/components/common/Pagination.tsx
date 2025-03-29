import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage, 
  totalPages, 
  onPageChange,
  className = ''
}) => {
  // Generate page numbers
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Always show first and last page
    if (totalPages <= maxVisiblePages) {
      // If total pages are less, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      // Adjust if we're near the end
      if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      }

      // Add first page if not shown
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push(-1); // Ellipsis
      }

      // Add visible pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add last page if not shown
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push(-1); // Ellipsis
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={`pagination-container flex justify-center space-x-2 ${className}`}>
      {/* Previous Button */}
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Previous
      </button>

      {/* Page Numbers */}
      {generatePageNumbers().map((page, index) => (
        page === -1 ? (
          <span key={`ellipsis-${index}`} className="px-4 py-2">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 border rounded ${
              currentPage === page 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-black'
            }`}
          >
            {page}
          </button>
        )
      ))}

      {/* Next Button */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;