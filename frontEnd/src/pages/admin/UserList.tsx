import { useEffect, useState } from "react";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { SignupFormData } from "../../types/IForm";
import Swal from "sweetalert2";
import { toast } from "react-toastify";


// Custom debounce hook
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const UserList = () => {
  const [users, setUsers] = useState<SignupFormData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

   // Debounce the search input (500ms delay)
   const debouncedSearch = useDebounce(search, 500);


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await CLIENT_API.get("/admin/users", {
        params: {
          page: currentPage,
          limit,
          search: debouncedSearch,
        },
      });
      setUsers(response.data.data);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("get users error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, limit, debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const changeStatus = (userId: string, isBlocked: boolean) => {
    const status = isBlocked ? "unblock" : "block";
    Swal.fire({
      title: `${status} user`,
      text: `Are you sure to ${status} the user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#28a745" : "#d33",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${status}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        CLIENT_API.patch(`/admin/user/${status}/${userId}`)
          .then((response) => {
            if (response.data.success) {
              setUsers((prevUsers) =>
                prevUsers.map((user) =>
                  user._id === userId ? { ...user, isBlocked: !isBlocked } : user
                )
              );
              toast.success("User status updated");
            }
          })
          .catch((error) => {
            console.error("User block/unblock error", error);
          });
      }
    });
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    
    // Add first page and previous button
    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
        }`}
      >
        &laquo;
      </button>
    );
    
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
        }`}
      >
        &lt;
      </button>
    );
    
    // Add page numbers
    const pageRange = 2; // Show 2 pages before and after current page
    const startPage = Math.max(1, currentPage - pageRange);
    const endPage = Math.min(totalPages, currentPage + pageRange);
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            i === currentPage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Add next and last page buttons
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
        }`}
      >
        &gt;
      </button>
    );
    
    buttons.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
        }`}
      >
        &raquo;
      </button>
    );
    
    return buttons;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6">User Management</h2>
      
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search by name...."
            value={search}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="limit" className="mr-2 text-gray-700">Show:</label>
          <select
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      
      {/* Table Container */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No users found. Try adjusting your search.
          </div>
        ) : (
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left border-b font-semibold">Name</th>
                <th className="px-4 py-2 text-left border-b font-semibold hidden sm:table-cell">Email</th>
                <th className="px-4 py-2 text-left border-b font-semibold hidden md:table-cell">Role</th>
                <th className="px-4 py-2 text-left border-b font-semibold">Status</th>
                <th className="px-4 py-2 text-left border-b font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user._id} 
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2">
                    <div className="sm:hidden">
                      <div>{user.userName}</div>
                      <div className="text-xs text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-600">{user.role}</div>
                    </div>
                    <div className="hidden sm:block">{user.userName}</div>
                  </td>
                  <td className="px-4 py-2 hidden sm:table-cell">{user.email}</td>
                  <td className="px-4 py-2 hidden md:table-cell">{user.role}</td>
                  <td className={`px-4 py-2 font-semibold ${
                    user.isBlocked ? "text-red-500" : "text-green-500"
                  }`}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className={`w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-white font-medium text-sm sm:text-base
                        ${user.isBlocked 
                          ? "bg-green-500 hover:bg-green-600" 
                          : "bg-red-500 hover:bg-red-600"
                        } transition-colors`}
                      onClick={() => changeStatus(user?._id ?? "", user?.isBlocked ?? false)}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination */}
      {users.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 mb-4 sm:mb-0">
            Showing {users.length} of {limit * totalPages} users - Page {currentPage} of {totalPages}
          </div>
          <div className="flex flex-wrap justify-center">
            {renderPaginationButtons()}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;