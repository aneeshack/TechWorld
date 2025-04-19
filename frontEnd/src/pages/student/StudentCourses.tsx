import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../redux/store";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { IEnrollment } from "../../types/IEnrollment";

interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const StudentCourses = () => {
  const user = useSelector((state: RootState) => state.auth.data);
  const [enrolledCourses, setEnrolledCourses] = useState<IEnrollment[] | null>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(2);

  const fetchCourses = async (page: number, searchTerm: string = "") => {
    setLoading(true);
    try {
      const response = await CLIENT_API.get(
        `/student/enrolled/${user?._id}?page=${page}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`
      );
      setEnrolledCourses(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching enrolled courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset to page 1 when search term changes
    setCurrentPage(1);
  }, [search]);
  
  useEffect(() => {
    if (user?._id) {
      fetchCourses(currentPage, search);
    }
  }, [user?._id, currentPage,search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchCourses(1, search);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-8 my-5 mx-5 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Enrolled Courses</h2>
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : enrolledCourses && enrolledCourses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div
                key={course.courseId}
                className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition duration-300"
              >
                <img
                  src={course?.courseDetails?.thumbnail}
                  alt="Course Thumbnail"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-center text-xl font-semibold text-blue-800">
                    {course?.courseDetails?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {course.courseDetails?.description}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                    {course.courseDetails?.category?.categoryName}
                  </span>
                  <div className="mt-4 flex justify-center">
                    <Link to={`/student/dashboard/course/${course.courseId}`}>
                      <button className="border rounded-md px-4 py-2 text-white font-bold bg-blue-600 hover:bg-blue-700 transition">
                        Continue Learning
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`px-3 py-1 mx-1 rounded-md ${
                    pagination.hasPrevPage
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 mx-1 rounded-md ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`px-3 py-1 mx-1 rounded-md ${
                    pagination.hasNextPage
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold text-gray-600">
            {search ? "No Courses Found" : "No Enrolled Courses"}
          </h3>
          <p className="text-gray-500 mt-2">
            {search
              ? `No courses match your search for "${search}"`
              : "You haven't enrolled in any courses yet. Explore available courses to get started!"}
          </p>
          <Link to="/courseList">
            <button className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
              Browse Courses
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;