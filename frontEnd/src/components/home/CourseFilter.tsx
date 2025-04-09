import { useCallback, useEffect, useState } from "react";
import courseBanner from '../../assets/commonPages/course.jpg';
import { CLIENT_API } from "../../utilities/axios/Axios";
import { ICourse } from "../../types/ICourse";
import { Link } from "react-router-dom";
import { CategoryEntity } from "../../types/ICategories";
import { debounce } from "lodash";

const CourseFilter = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number } | null>(null);
  const [sortOrder, setSortOrder] = useState<"" | "asc" | "desc">("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const limit = 4;

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params = new URLSearchParams({
          ...(debouncedSearchTerm && { searchTerm: debouncedSearchTerm }),
          ...(selectedCategories.length > 0 && { categories: selectedCategories.join(",") }),
          ...(selectedPrice?.min && { priceMin: selectedPrice.min.toString() }),
          ...(selectedPrice?.max && selectedPrice.max !== Infinity && { priceMax: selectedPrice.max.toString() }),
          ...(sortOrder && { sortOrder }),
          page: currentPage.toString(),
          limit: limit.toString(),
        });

        const response = await CLIENT_API.get(`/user/courses?${params.toString()}`);
        setCourses(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("API error", error);
      }
    };

    fetchCourses();
  }, [debouncedSearchTerm, selectedCategories, selectedPrice, sortOrder, currentPage]);

  useEffect(() => {
    CLIENT_API.get("/user/categories")
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.error("API error", error);
      });
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (priceRange: { min: number; max: number }) => {
    setSelectedPrice(priceRange);
    setCurrentPage(1);
  };

  const handleSortChange = (order: "" | "asc" | "desc") => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Banner */}
      <div className="flex justify-center mb-6">
        <img 
          src={courseBanner} 
          alt="course banner" 
          className="h-40 sm:h-52 md:h-64 lg:h-72 w-full object-cover rounded-lg"
        />
      </div>

      {/* Title */}
      <div className="my-4 sm:my-6 px-4 sm:p-6 rounded-lg flex justify-center">
        <h1 className="rounded-md shadow-xl bg-blue-100 text-blue-800 px-4 py-3 sm:p-6 sm:px-8 md:px-12 lg:px-24 text-xl sm:text-2xl font-bold text-center">
          TechWorld courses for all levels
        </h1>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search for courses..."
          className="p-3 border border-gray-300 rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 text-sm sm:text-base"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Main Content */}
      <div className="flex justify-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
          {/* Filters Sidebar */}
          <div className="md:col-span-3 p-4 shadow-xl rounded-lg bg-white">
            <h2 className="text-lg font-semibold">Course Category</h2>
            <ul className="mt-2 space-y-2">
              {categories.map((category) => (
                <li key={category._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedCategories.includes(category._id ?? '')}
                    onChange={() => handleCategoryChange(category._id ?? '')}
                  />
                  <span className="text-sm sm:text-base">{category.categoryName}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-lg font-semibold mt-4">Price</h2>
            <ul className="mt-2 space-y-2">
              {[
                { label: "All", min: 0, max: Infinity },
                { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
                { label: "₹20,000 - ₹30,000", min: 20000, max: 30000 },
                { label: "₹30,000+", min: 30000, max: Infinity },
              ].map((priceRange, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="price"
                    className="form-radio"
                    checked={selectedPrice?.min === priceRange.min}
                    onChange={() => handlePriceChange(priceRange)}
                  />
                  <span className="text-sm sm:text-base">{priceRange.label}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-lg font-semibold mt-4">Sort By Price</h2>
            <select
              className="p-2 border border-gray-300 rounded-lg w-full mt-2 text-sm sm:text-base"
              onChange={(e) => handleSortChange(e.target.value as "" | "asc" | "desc")}
            >
              <option value="">Default</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>

          {/* Courses List */}
          <div className="md:col-span-9 md:ml-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">All Courses</h2>
            {courses.length === 0 ? (
              <p className="text-center text-gray-500 text-lg sm:text-xl">No courses found</p>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <Link key={course._id} to={`/courseDetail/${course._id}`}>
                    <div className="flex flex-col sm:flex-row bg-white p-4 shadow rounded-lg">
                      <img 
                        src={course.thumbnail} 
                        alt="Course" 
                        className="w-full sm:w-32 md:w-40 h-32 rounded-lg object-cover mb-4 sm:mb-0"
                      />
                      <div className="sm:ml-6 w-full">
                        <h3 className="text-lg sm:text-xl font-bold">{course.title}</h3>
                        <p className="text-sm sm:text-base font-semibold text-blue-600">By {course.instructor.userName}</p>
                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{course.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2 items-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs sm:text-sm">
                            {course.category.categoryName}
                          </span>
                          <p className="text-green-600 font-semibold text-sm sm:text-base">
                            Rs: {course.price}
                          </p>
                        </div>
                        {course.rating && course?.rating > 0 && (
                          <div className="mt-2">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span
                                key={i}
                                className={`text-yellow-500 text-sm sm:text-base ${
                                  i < (course.rating || 0) ? 'opacity-100' : 'opacity-30'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {/* Pagination */}
            <div className="mt-6">
              {totalPages > 1 ? (
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 w-full sm:w-auto text-sm sm:text-base"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm sm:text-base">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 w-full sm:w-auto text-sm sm:text-base"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              ) : (
                <p className="text-center text-sm sm:text-base">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseFilter;