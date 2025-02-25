// import { useEffect, useState } from "react";
// import courseBanner from '../../assets/commonPages/course.jpg'
// import { CLIENT_API } from "../../utilities/axios/Axios";
// import { ICourse } from "../../types/ICourse";
// import { Link } from "react-router-dom";
// import { CategoryEntity } from "../../types/ICategories";


// const CourseFilter = ()=> {
//   const [courses, setCourses] = useState<ICourse[]>([]);
//   const [ categories, setCategories] = useState<CategoryEntity[]>([])
//   const [searchTerm, setSearchTerm] = useState<string>("");

//  useEffect(() => {
//     CLIENT_API.get("/user/courses")
//       .then((response) => {
//         setCourses(response.data.data);
//       })
//       .catch((error) => {
//         console.log("api error", error);
//       });
//   }, []);

//   useEffect(() => {
//     CLIENT_API.get("/user/categories")
//       .then((response) => {
//         console.log("response", response);
//         setCategories(response.data.data);
//       })
//       .catch((error) => {
//         console.log("api error", error);
//       });
//   }, []);


//   const filteredCourses = searchTerm
//   ? courses.filter((course) =>
//       course.title?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   : courses;

//   return (
//     <div className="container mx-auto p-6" >
//         <div className="flex justify-center">
//         <img src={courseBanner} alt="course banner" className="h-52 w-full lg:h-72 lg:w-5/6 object-cover rounded-lg" />
//         </div>

//         {/* header */}
//        <div className="my-6 p-6 rounded-lg flex justify-center  ">
//         <h1 className="rounded-md shadow-xl bg-blue-100 text-blue-800 p-6 px-24 lg:px-48 text-2xl font-bold">TechWorld courses for all levels</h1>
//       </div>
//       <div className="flex justify-center mb-6">
//         <input
//           type="text"
//           placeholder="Search for courses..."
//           className="p-3 border border-gray-300 rounded-lg w-2/3"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//        <div className="flex justify-center"> 
//       <div className="grid lg:w-5/6  grid-cols-12 gap-6 mt-6">

//         {/* Sidebar */}
//         <div className="col-span-3  p-4 shadow-xl rounded-lg">
//           <h2 className="text-lg font-semibold">Course Category</h2>
//           <ul className="mt-2 space-y-2">
//               {categories && categories.map((category)=>(

//               <li key={category._id} className="flex items-center space-x-2">
//                 <input type="checkbox" className="form-checkbox" />
//                 <span>{category.categoryName}</span>
//               </li>
//               ))}
            
//           </ul>
//           <h2 className="text-lg font-semibold mt-4">Price</h2>
//           {/* <ul className="mt-2">
//             {["All", "Free", "Paid"].map((price, idx) => (
//               <li key={idx} className="flex items-center space-x-2">
//                 <input type="radio" name="price" className="form-radio" />
//                 <span>{price}</span>
//               </li>
//             ))}
//           </ul> */}
//           <ul className="mt-2">
//           {[
//             { label: "10,000 - 20,000", min: 10000, max: 20000 },
//             { label: "20,000 - 30,000", min: 20000, max: 30000 },
//             { label: "30,000+", min: 30000, max: Infinity },
//           ].map((priceRange, idx) => (
//             <li key={idx} className="flex items-center space-x-2">
//               <input
//                 type="radio"
//                 name="price"
//                 className="form-radio my-3"
//                 // onChange={() => setPriceFilter(priceRange)}
//               />
//               <span>{priceRange.label}</span>
//             </li>
//           ))}
//         </ul>
//         </div>
        
//         {/* Course List */}
//         {filteredCourses.length ===0 ?(
//           <p className="text-center text-gray-500 text-xl">No courses found</p>
//         ):(
//         <div className="col-span-9 ml-10">
//           <h2 className="text-3xl font-bold mb-4">All Courses</h2>
//           <div className="space-y-4 ">
//             {filteredCourses.map((course, index) => (
//                 <Link to={`/courseDetail/${course._id}`}>
//               <div key={index} className="flex bg-white p-4 shadow rounded-lg">
//                 <img src={course.thumbnail} alt="Course" className="w-40 h-32 rounded-lg object-cover" />
//                 <div className="ml-6">
//                   <h3 className="text-xl font-bold">{course.title}</h3>
//                   <p className="text-m  font-semibold text-blue-600">By {course.instructor.userName}</p>
//                   <div className="flex my-2 space-x-4 text-sm text-gray-500 mt-1">
//                     <span>{course.description}</span>
//                   </div>
//                   <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">{course.category.categoryName}</span>
//                   <p className="text-green-600 font-semibold mt-2">Rs: {course.price}</p>
//                 </div>
//               </div>
//                 </Link> 
//             ))}
//           </div>
          
//         </div>
//         )}
        
//       </div>
//       </div>
//     </div>
//   );
// }

// export default CourseFilter

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
  const [sortOrder, setSortOrder] = useState<string>(""); // Sorting order: "asc" or "desc"

  useEffect(() => {
    CLIENT_API.get("/user/courses")
      .then((response) => {
        setCourses(response.data.data);
      })
      .catch((error) => {
        console.log("API error", error);
      });
  }, []);

  useEffect(() => {
    CLIENT_API.get("/user/categories")
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.log("API error", error);
      });
  }, []);

  // Function to handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  // Function to handle price range selection
  const handlePriceChange = (priceRange: { min: number; max: number }) => {
    setSelectedPrice(priceRange);
  };

  // Function to handle sorting
  const handleSortChange = (order: string) => {
    setSortOrder(order);
  };

  // Filtering courses based on search, category, and price
  const filteredCourses = courses
    .filter((course) =>
      searchTerm ? course.title?.toLowerCase().includes(searchTerm.toLowerCase()) : true
    )
    .filter((course) =>
      selectedCategories.length > 0 ? selectedCategories.includes(course.category._id) : true
    )
    .filter((course) =>
      selectedPrice ? course.price >= selectedPrice.min && course.price <= selectedPrice.max : true
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center">
        <img src={courseBanner} alt="course banner" className="h-52 w-full lg:h-72 lg:w-5/6 object-cover rounded-lg" />
      </div>

      {/* Header */}
      <div className="my-6 p-6 rounded-lg flex justify-center">
        <h1 className="rounded-md shadow-xl bg-blue-100 text-blue-800 p-6 px-24 lg:px-48 text-2xl font-bold">
          TechWorld courses for all levels
        </h1>
      </div>

      {/* Search Input */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search for courses..."
          className="p-3 border border-gray-300 rounded-lg w-2/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex justify-center">
        <div className="grid lg:w-5/6 grid-cols-12 gap-6 mt-6">

          {/* Sidebar Filters */}
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

            {/* Price Filter */}
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

            {/* Sorting Dropdown */}
            <h2 className="text-lg font-semibold mt-4">Sort By Price</h2>
            <select
              className="p-2 border border-gray-300 rounded-lg w-full mt-2"
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="">Default</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>

          {/* Course List */}
          <div className="col-span-9 ml-10">
            <h2 className="text-3xl font-bold mb-4">All Courses</h2>
            {filteredCourses.length === 0 ? (
              <p className="text-center text-gray-500 text-xl">No courses found</p>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course) => (
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
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseFilter;
