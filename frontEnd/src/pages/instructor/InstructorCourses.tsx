import { useEffect, useState } from "react";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { ICourse } from "../../types/ICourse";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const InstructorCourses = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [limit, setLimit] = useState<number>(6);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, [currentPage, limit, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await CLIENT_API.get("/categories");
      console.log('response',response)
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await CLIENT_API.get("/instructor/allCourses", {
        params: {
          page: currentPage,
          limit: limit,
          search: searchTerm,
          category: selectedCategory,
          sort: sortBy
        },
      });

      setCourses(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalCourses(response.data.totalCourses);
    } catch (error) {
      console.error("API error", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCourses();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("newest");
    setCurrentPage(1);
    setLimit(6);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const publishCourse = (courseId: string) => {
    Swal.fire({
      title: "Publish Course?",
      text: "Are you sure you want to publish this course?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Publish",
    }).then((result) => {
      if (result.isConfirmed) {
        CLIENT_API.patch(`/instructor/course/publish/${courseId}`)
          .then((response) => {
            if (response.data.success) {
              setCourses((prevCourses) =>
                prevCourses.map((course) =>
                  course._id === courseId
                    ? { ...course, isPublished: true }
                    : course
                )
              );
              toast.success("Successfully published your course");
            }
          })
          .catch((error) => {
            console.log("API error", error);
            const errorMessage =
              error.response?.data?.message || "Something went wrong!";
            toast.error(errorMessage);
          });
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-b from-dark-green to-green-900 min-h-screen">
      {/* Dashboard Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800">My Courses</h2>
            <p className="text-gray-600 mt-1">Manage and organize your teaching content</p>
          </div>
          <Link to="/instructor/dashboard/createCourse">
            <button className="transition-all duration-300 text-white font-semibold bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg w-full sm:w-auto flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Course
            </button>
          </Link>
        </div>

        {/* Course Stats and Quick Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-blue-800 font-semibold">Total Courses</p>
            <p className="text-2xl font-bold text-blue-600">{totalCourses}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <p className="text-green-800 font-semibold">Published</p>
            <p className="text-2xl font-bold text-green-600">
              {courses.filter(course => course.isPublished).length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
            <p className="text-yellow-800 font-semibold">Unpublished</p>
            <p className="text-2xl font-bold text-yellow-600">
              {courses.filter(course => !course.isPublished).length}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
            <p className="text-purple-800 font-semibold">Current Page</p>
            <p className="text-2xl font-bold text-purple-600">{currentPage} of {totalPages}</p>
          </div>
        </div>
      </div>

   {/* Search Section */}
   <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Search Courses</h3>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search courses by title..."
              className="pl-10 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Search
            </button>
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Course Display Section */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-green-600 border-green-200"></div>
          <p className="mt-4 text-gray-600">Loading your courses...</p>
        </div>
      ) : courses.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Display heading with count */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Showing {courses.length} of {totalCourses} courses
            </h3>
            <div className="flex items-center gap-2">
              <label htmlFor="limit" className="text-gray-600 text-sm">
                Items per page:
              </label>
              <select
                id="limit"
                value={limit}
                onChange={handleLimitChange}
                className="rounded p-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="9">9</option>
                <option value="12">12</option>
              </select>
            </div>
          </div>

          {/* Courses Grid with improved card design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col h-full group"
              >
                <div className="relative overflow-hidden">
                  <Link to={`/instructor/dashboard/editCourse/${course._id}`}>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                      data-tooltip-id={`edit-tooltip-${index}`}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-medium px-4 py-2 bg-green-600 bg-opacity-90 rounded-lg">
                        Edit Course
                      </span>
                    </div>
                  </Link>
                  <Tooltip
                    id={`edit-tooltip-${index}`}
                    place="top"
                    content="Edit Course"
                  />
                  {/* Status badge */}
                  {course.isPublished ? (
                    <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Published
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Draft
                    </span>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  {/* Category tag */}
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 mb-3 w-fit">
                    {course.category.categoryName}
                  </span>
                
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-green-700 transition-colors">
                    <Link to={`/instructor/dashboard/editCourse/${course._id}`}>
                      {course.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  {/* Course stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>{course.lessonCount || 0} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Created: {new Date(course?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    {course.lessonCount && course.lessonCount > 0 ? (
                      !course.isPublished ? (
                        <button
                          onClick={() => publishCourse(course._id ?? "")}
                          className="flex-1 rounded-lg p-2 text-white font-medium bg-green-600 hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Publish
                        </button>
                      ) : (
                        <span className="flex-1 rounded-lg p-2 text-green-800 font-medium bg-green-100 text-sm flex items-center justify-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Published
                        </span>
                      )
                    ) : null}
                    <Link
                      to={`/instructor/dashboard/lesson/${course._id}/add`}
                      className="flex-1"
                    >
                      <button className="w-full rounded-lg p-2 text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Lessons
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Improved Pagination Controls */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-l-lg text-sm ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                } border border-gray-300`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M7.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L3.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                } border-t border-b border-gray-300`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Dynamic page number buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // For large number of pages, show limited buttons with ellipsis
                if (
                  totalPages <= 7 ||
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 text-sm border-t border-b border-gray-300 ${
                        currentPage === page
                          ? "bg-blue-600 text-white font-medium"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  (page === 2 && currentPage > 3) ||
                  (page === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span
                      key={page}
                      className="px-4 py-2 text-sm border-t border-b border-gray-300 bg-white text-gray-700"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                } border-t border-b border-gray-300`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-r-lg text-sm ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                } border border-gray-300`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L16.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
            {searchTerm || selectedCategory ? (
              <p className="text-gray-600 mb-6">
                No results match your current search criteria
              </p>
            ) : (
              <p className="text-gray-600 mb-6">
                You haven't created any courses yet
              </p>
            )}
            
            {(searchTerm || selectedCategory) && (
              <button
                className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center gap-2"
                onClick={handleClearFilters}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filters and try again
              </button>
            )}
            
            {!searchTerm && !selectedCategory && (
              <Link to="/instructor/dashboard/createCourse">
                <button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    
                  </svg>
                  Create Your First Course
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;