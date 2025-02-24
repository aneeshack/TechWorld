

import { useEffect, useState } from "react";
import courseBanner from '../../assets/commonPages/course.jpg'
import { CLIENT_API } from "../../utilities/axios/Axios";
import { ICourse } from "../../types/ICourse";
import { Link } from "react-router-dom";
// import { Pagination, Star } from "lucide-react";


const CourseFilter = ()=> {
  const [courses, setCourses] = useState<ICourse[]>([]);

 useEffect(() => {
    CLIENT_API.get("/user/courses")
      .then((response) => {
        setCourses(response.data.data);
      })
      .catch((error) => {
        console.log("api error", error);
      });
  }, []);


  return (
    <div className="container mx-auto p-6" >
        <div className="flex justify-center">
        <img src={courseBanner} alt="course banner" className="h-52 w-full lg:h-72 lg:w-5/6 object-cover rounded-lg" />
        </div>
      {/* Header */}
      {/* <div className="bg-green-100 mt-6 p-6 rounded-lg flex items-center justify-between">
        <h1 className="text-2xl font-semibold">EduWorld courses for all levels</h1>
      </div>
       */}
       <div className="my-6 p-6 rounded-lg flex justify-center  ">
        <h1 className="rounded-md shadow-xl bg-blue-100 text-blue-800 p-6 px-24 lg:px-48 text-2xl font-bold">EduWorld courses for all levels</h1>
      </div>
       <div className="flex justify-center"> 
              
      
      <div className="grid lg:w-5/6  grid-cols-12 gap-6 mt-6">

        {/* Sidebar */}
        <div className="col-span-3 p-4 shadow-xl rounded-lg">
          <h2 className="text-lg font-semibold">Course Category</h2>
          <ul className="mt-2 space-y-2">
            {["Commercial", "Office", "B2B", "E-learning"].map((cat, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>{cat}</span>
              </li>
            ))}
          </ul>
          <h2 className="text-lg font-semibold mt-4">Price</h2>
          <ul className="mt-2">
            {["All", "Free", "Paid"].map((price, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <input type="radio" name="price" className="form-radio" />
                <span>{price}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Course List */}
        <div className="col-span-9 ml-10">
          <h2 className="text-3xl font-bold mb-4">All Courses</h2>
          <div className="space-y-4 ">
            {courses.map((course, index) => (
                <Link to={`/courseDetail/${course._id}`}>
              <div key={index} className="flex bg-white p-4 shadow rounded-lg">
                <img src={course.thumbnail} alt="Course" className="w-40 h-32 rounded-lg object-cover" />
                <div className="ml-6">
                  <h3 className="text-xl font-bold">{course.title}</h3>
                  <p className="text-m  font-semibold text-blue-600">By {course.instructor.userName}</p>
                  <div className="flex my-2 space-x-4 text-sm text-gray-500 mt-1">
                    <span>{course.description}</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">{course.category.categoryName}</span>
                  <p className="text-green-600 font-semibold mt-2">Rs: {course.price}</p>
                </div>
              </div>
                </Link> 
            ))}
          </div>

          {/* Pagination */}
          {/* <div className="flex justify-center mt-6 space-x-2">
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === page ? "bg-green-600 text-white" : "bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div> */}
        </div>
      </div>
      </div>
    </div>
  );
}

export default CourseFilter