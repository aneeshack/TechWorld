import { useEffect, useState } from "react";
import courseBanner from '../../assets/commonPages/course.jpg';
import { CLIENT_API } from "../../utilities/axios/Axios";
import { ICourse } from "../../types/ICourse";
import { Link } from "react-router-dom";
import { CategoryEntity } from "../../types/ICategories";

const CourseFilter = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number } | null>(null);
  const [sortOrder, setSortOrder] = useState<"" | "asc" | "desc">("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10; // Items per page

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params = new URLSearchParams({
          ...(searchTerm && { searchTerm }),
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
  }, [searchTerm, selectedCategories, selectedPrice, sortOrder, currentPage]); // Refetch when filters or page change

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
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handlePriceChange = (priceRange: { min: number; max: number }) => {
    setSelectedPrice(priceRange);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleSortChange = (order: "" | "asc" | "desc") => {
    setSortOrder(order);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center">
        <img src={courseBanner} alt="course banner" className="h-52 w-full lg:h-72 lg:w-5/6 object-cover rounded-lg" />
      </div>

      <div className="my-6 p-6 rounded-lg flex justify-center">
        <h1 className="rounded-md shadow-xl bg-blue-100 text-blue-800 p-6 px-24 lg:px-48 text-2xl font-bold">
          TechWorld courses for all levels
        </h1>
      </div>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search for courses..."
          className="p-3 border border-gray-300 rounded-lg w-2/3"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} // Reset to page 1
        />
      </div>

      <div className="flex justify-center">
        <div className="grid lg:w-5/6 grid-cols-12 gap-6 mt-6">
          <div className="col-span-3 p-4 shadow-xl rounded-lg">
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
                  <span>{category.categoryName}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-lg font-semibold mt-4">Price</h2>
            <ul className="mt-2">
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
                    className="form-radio my-3"
                    checked={selectedPrice?.min === priceRange.min}
                    onChange={() => handlePriceChange(priceRange)}
                  />
                  <span>{priceRange.label}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-lg font-semibold mt-4">Sort By Price</h2>
            <select
              className="p-2 border border-gray-300 rounded-lg w-full mt-2"
              onChange={(e) => handleSortChange(e.target.value as "" | "asc" | "desc")}
            >
              <option value="">Default</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>

          <div className="col-span-9 ml-10">
            <h2 className="text-3xl font-bold mb-4">All Courses</h2>
            {courses.length === 0 ? (
              <p className="text-center text-gray-500 text-xl">No courses found</p>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <Link key={course._id} to={`/courseDetail/${course._id}`}>
                    <div className="flex bg-white p-4 shadow rounded-lg">
                      <img src={course.thumbnail} alt="Course" className="w-40 h-32 rounded-lg object-cover" />
                      <div className="ml-6">
                        <h3 className="text-xl font-bold">{course.title}</h3>
                        <p className="text-m font-semibold text-blue-600">By {course.instructor.userName}</p>
                        <p className="text-sm text-gray-500">{course.description}</p>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">
                          {course.category.categoryName}
                        </span>
                        <p className="text-green-600 font-semibold mt-2">Rs: {course.price}</p>
                      {course.rating && course?.rating >0 ? (
                        Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={`text-yellow-500 ${i < (course.rating || 0) ? 'opacity-100' : 'opacity-30'}`}
                          >
                            ★
                          </span>
                        ))
                      ):''}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          <div className="mt-6">
            {totalPages > 1 ? (
              <div className="flex justify-center space-x-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            ) : (
              <p className="text-center">Page {currentPage} of {totalPages}</p>
            )}
          </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseFilter;