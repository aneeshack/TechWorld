// import { useEffect, useState } from "react";
// import { CLIENT_API } from "../../utilities/axios/Axios";
// import { SignupFormData } from "../../types/IForm";
// import Swal from "sweetalert2";
// import { toast } from "react-toastify";


// // Custom debounce hook
// const useDebounce = <T,>(value: T, delay: number): T => {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };

// const UserList = () => {
//   const [users, setUsers] = useState<SignupFormData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [search, setSearch] = useState<string>("");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const [limit, setLimit] = useState<number>(10);

//    // Debounce the search input (500ms delay)
//    const debouncedSearch = useDebounce(search, 500);


//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const response = await CLIENT_API.get("/admin/users", {
//         params: {
//           page: currentPage,
//           limit,
//           search: debouncedSearch,
//         },
//       });
//       setUsers(response.data.data);
//       setTotalPages(response.data.totalPages);
//       setLoading(false);
//     } catch (error) {
//       console.error("get users error", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [currentPage, limit, debouncedSearch]);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearch(e.target.value);
//     setCurrentPage(1); // Reset to first page on new search
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setLimit(Number(e.target.value));
//     setCurrentPage(1); // Reset to first page when changing limit
//   };

//   const changeStatus = (userId: string, isBlocked: boolean) => {
//     const status = isBlocked ? "unblock" : "block";
//     Swal.fire({
//       title: `${status} user`,
//       text: `Are you sure to ${status} the user?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: isBlocked ? "#28a745" : "#d33",
//       cancelButtonColor: "#d33",
//       confirmButtonText: `Yes, ${status}!`,
//     }).then((result) => {
//       if (result.isConfirmed) {
//         CLIENT_API.patch(`/admin/user/${status}/${userId}`)
//           .then((response) => {
//             if (response.data.success) {
//               setUsers((prevUsers) =>
//                 prevUsers.map((user) =>
//                   user._id === userId ? { ...user, isBlocked: !isBlocked } : user
//                 )
//               );
//               toast.success("User status updated");
//             }
//           })
//           .catch((error) => {
//             console.error("User block/unblock error", error);
//           });
//       }
//     });
//   };

//   // Generate pagination buttons
//   const renderPaginationButtons = () => {
//     const buttons = [];
    
//     // Add first page and previous button
//     buttons.push(
//       <button
//         key="first"
//         onClick={() => handlePageChange(1)}
//         disabled={currentPage === 1}
//         className={`px-3 py-1 mx-1 rounded ${
//           currentPage === 1
//             ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//             : "bg-gray-200 hover:bg-gray-300 text-gray-700"
//         }`}
//       >
//         &laquo;
//       </button>
//     );
    
//     buttons.push(
//       <button
//         key="prev"
//         onClick={() => handlePageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className={`px-3 py-1 mx-1 rounded ${
//           currentPage === 1
//             ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//             : "bg-gray-200 hover:bg-gray-300 text-gray-700"
//         }`}
//       >
//         &lt;
//       </button>
//     );
    
//     // Add page numbers
//     const pageRange = 2; // Show 2 pages before and after current page
//     const startPage = Math.max(1, currentPage - pageRange);
//     const endPage = Math.min(totalPages, currentPage + pageRange);
    
//     for (let i = startPage; i <= endPage; i++) {
//       buttons.push(
//         <button
//           key={i}
//           onClick={() => handlePageChange(i)}
//           className={`px-3 py-1 mx-1 rounded ${
//             i === currentPage
//               ? "bg-blue-500 text-white"
//               : "bg-gray-200 hover:bg-gray-300 text-gray-700"
//           }`}
//         >
//           {i}
//         </button>
//       );
//     }
    
//     // Add next and last page buttons
//     buttons.push(
//       <button
//         key="next"
//         onClick={() => handlePageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className={`px-3 py-1 mx-1 rounded ${
//           currentPage === totalPages
//             ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//             : "bg-gray-200 hover:bg-gray-300 text-gray-700"
//         }`}
//       >
//         &gt;
//       </button>
//     );
    
//     buttons.push(
//       <button
//         key="last"
//         onClick={() => handlePageChange(totalPages)}
//         disabled={currentPage === totalPages}
//         className={`px-3 py-1 mx-1 rounded ${
//           currentPage === totalPages
//             ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//             : "bg-gray-200 hover:bg-gray-300 text-gray-700"
//         }`}
//       >
//         &raquo;
//       </button>
//     );
    
//     return buttons;
//   };

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       <h2 className="text-xl sm:text-2xl font-semibold mb-6">User Management</h2>
      
//       {/* Search and Filters */}
//       <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
//         <div className="flex-grow">
//           <input
//             type="text"
//             placeholder="Search by name...."
//             value={search}
//             onChange={handleSearch}
//             className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="flex items-center">
//           <label htmlFor="limit" className="mr-2 text-gray-700">Show:</label>
//           <select
//             id="limit"
//             value={limit}
//             onChange={handleLimitChange}
//             className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//             <option value={50}>50</option>
//           </select>
//         </div>
//       </div>
      
//       {/* Table Container */}
//       <div className="overflow-x-auto bg-white rounded-lg shadow-md">
//         {loading ? (
//           <div className="flex justify-center items-center p-8">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
//           </div>
//         ) : users.length === 0 ? (
//           <div className="text-center p-8 text-gray-500">
//             No users found. Try adjusting your search.
//           </div>
//         ) : (
//           <table className="w-full border-collapse text-sm sm:text-base">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="px-4 py-2 text-left border-b font-semibold">Name</th>
//                 <th className="px-4 py-2 text-left border-b font-semibold hidden sm:table-cell">Email</th>
//                 <th className="px-4 py-2 text-left border-b font-semibold hidden md:table-cell">Role</th>
//                 <th className="px-4 py-2 text-left border-b font-semibold">Status</th>
//                 <th className="px-4 py-2 text-left border-b font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr 
//                   key={user._id} 
//                   className="border-b hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="px-4 py-2">
//                     <div className="sm:hidden">
//                       <div>{user.userName}</div>
//                       <div className="text-xs text-gray-600">{user.email}</div>
//                       <div className="text-xs text-gray-600">{user.role}</div>
//                     </div>
//                     <div className="hidden sm:block">{user.userName}</div>
//                   </td>
//                   <td className="px-4 py-2 hidden sm:table-cell">{user.email}</td>
//                   <td className="px-4 py-2 hidden md:table-cell">{user.role}</td>
//                   <td className={`px-4 py-2 font-semibold ${
//                     user.isBlocked ? "text-red-500" : "text-green-500"
//                   }`}>
//                     {user.isBlocked ? "Blocked" : "Active"}
//                   </td>
//                   <td className="px-4 py-2">
//                     <button
//                       className={`w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-white font-medium text-sm sm:text-base
//                         ${user.isBlocked 
//                           ? "bg-green-500 hover:bg-green-600" 
//                           : "bg-red-500 hover:bg-red-600"
//                         } transition-colors`}
//                       onClick={() => changeStatus(user?._id ?? "", user?.isBlocked ?? false)}
//                     >
//                       {user.isBlocked ? "Unblock" : "Block"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
      
//       {/* Pagination */}
//       {users.length > 0 && (
//         <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
//           <div className="text-sm text-gray-600 mb-4 sm:mb-0">
//             Showing {users.length} of {limit * totalPages} users - Page {currentPage} of {totalPages}
//           </div>
//           <div className="flex flex-wrap justify-center">
//             {renderPaginationButtons()}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserList;







import { useEffect, useState } from "react";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { SignupFormData } from "../../types/IForm";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Search, Users, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Shield, User } from "lucide-react";

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
  const [activeRow, setActiveRow] = useState<string | null>(null);

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
      toast.error("Failed to load users. Please try again.");
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
      title: `${status.charAt(0).toUpperCase() + status.slice(1)} User`,
      text: `Are you sure you want to ${status} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#10B981" : "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: `Yes, ${status}!`,
      cancelButtonText: "Cancel",
      background: "#FFFFFF",
      customClass: {
        title: "text-gray-800 font-bold",
        popup: "rounded-lg shadow-xl border border-gray-200",
      }
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
              toast.success(`User successfully ${status}ed`);
            }
          })
          .catch((error) => {
            console.error("User block/unblock error", error);
            toast.error(`Failed to ${status} user. Please try again.`);
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
        aria-label="First page"
        className={`flex items-center justify-center w-9 h-9 rounded-md transition-all ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
        }`}
      >
        <ChevronsLeft size={16} />
      </button>
    );
    
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`flex items-center justify-center w-9 h-9 rounded-md ml-1 transition-all ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
        }`}
      >
        <ChevronLeft size={16} />
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
          aria-label={`Page ${i}`}
          aria-current={i === currentPage ? "page" : undefined}
          className={`flex items-center justify-center w-9 h-9 rounded-md ml-1 font-medium transition-all ${
            i === currentPage
              ? "bg-indigo-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
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
        aria-label="Next page"
        className={`flex items-center justify-center w-9 h-9 rounded-md ml-1 transition-all ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
        }`}
      >
        <ChevronRight size={16} />
      </button>
    );
    
    buttons.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Last page"
        className={`flex items-center justify-center w-9 h-9 rounded-md ml-1 transition-all ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
        }`}
      >
        <ChevronsRight size={16} />
      </button>
    );
    
    return buttons;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-r from-green-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center text-white">
          <Users className="h-8 w-8 mr-3" />
          <h2 className="text-2xl font-bold">User Management</h2>
        </div>
        <p className="text-indigo-100 mt-2">Manage and monitor user accounts</p>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="limit" className="mr-2 text-gray-700 font-medium">Show:</label>
          <select
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all"
          >
            <option value={5}>5 users</option>
            <option value={10}>10 users</option>
            <option value={25}>25 users</option>
            <option value={50}>50 users</option>
          </select>
        </div>
      </div>
      
      {/* Table Container */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <Search className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-lg font-medium">No users found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr 
                  key={user._id} 
                  className={`hover:bg-indigo-50 transition-colors ${activeRow === user._id ? 'bg-indigo-50' : ''}`}
                  onMouseEnter={() => setActiveRow(user._id || null)}
                  onMouseLeave={() => setActiveRow(null)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="sm:hidden">
                      <div className="font-medium text-gray-900">{user.userName}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-sm flex items-center mt-1">
                        <Shield size={14} className="mr-1 text-gray-500" />
                        <span>{user.role}</span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center">
                      <User className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="font-medium text-gray-900">{user.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      <Shield size={12} className="mr-1" />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      user.isBlocked 
                        ? "bg-red-100 text-red-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-1.5 ${
                        user.isBlocked ? "bg-red-500" : "bg-green-500"
                      }`}></span>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className={`inline-flex items-center px-3.5 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all ${
                        user.isBlocked 
                          ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" 
                          : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2`}
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
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            <span className="font-medium">Showing </span>
            <span className="font-bold text-indigo-600">{users.length}</span>
            <span> of </span>
            <span className="font-bold text-indigo-600">{limit * totalPages}</span>
            <span> users • Page </span>
            <span className="font-bold text-indigo-600">{currentPage}</span>
            <span> of </span>
            <span className="font-bold text-indigo-600">{totalPages}</span>
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