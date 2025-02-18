

import { useState } from "react";
import courseBanner from '../../assets/commonPages/course.png'
// import { Pagination, Star } from "lucide-react";

const courses = new Array(6).fill({
  title: "Create an LMS Website With LearnPress",
  instructor: "Dr. Daniel Park",
  duration: "2 Weeks",
  students: "150 Students",
  level: "All Levels",
  lessons: "32 Lessons",
  price: "$0 / Free",
  image: courseBanner,
});

const CourseFilter = ()=> {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="container mx-auto p-6" >
        <div className="flex justify-center">
        <img src={courseBanner} alt="course banner" className="h-40 w-full lg:h-72 lg:w-5/6 object-cover rounded-lg" />
        </div>
      {/* Header */}
      {/* <div className="bg-green-100 mt-6 p-6 rounded-lg flex items-center justify-between">
        <h1 className="text-2xl font-semibold">EduWorld courses for all levels</h1>
      </div>
       */}
       <div className="my-6 p-6 rounded-lg flex justify-center  ">
        <h1 className="rounded-md shadow-xl p-6 px-24 lg:px-48 text-2xl font-bold">EduWorld courses for all levels</h1>
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
        <div className="col-span-9">
          <h2 className="text-3xl font-bold mb-4">All Courses</h2>
          <div className="space-y-4">
            {courses.map((course, index) => (
              <div key={index} className="flex bg-white p-4 shadow rounded-lg">
                <img src={course.image} alt="Course" className="w-40 h-24 rounded-lg object-cover" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p className="text-sm text-gray-600">By {course.instructor}</p>
                  <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                    <span>{course.duration}</span>
                    <span>{course.students}</span>
                    <span>{course.level}</span>
                    <span>{course.lessons}</span>
                  </div>
                  <p className="text-green-600 font-semibold mt-2">{course.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
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
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default CourseFilter