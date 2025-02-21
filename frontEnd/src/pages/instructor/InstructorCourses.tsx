import { useEffect, useState } from "react";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { ICourse } from "../../types/ICourse";
import { Link } from "react-router-dom";
import { Tooltip } from 'react-tooltip';

const InstructorCourses = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  useEffect(() => {
    CLIENT_API.get("/instructor/allCourses")
      .then((response) => {
        setCourses(response.data.data);
      })
      .catch((error) => {
        console.log("api error", error);
      });
  }, []);
  return (
    <div className="p-8 bg-dark-green min-h-screen">
      <div className="flex justify-end">
        <a href="/instructor/dashboard/createCourse">
          {/* <button className="  border bg-green-700 p-4 rounded-lg text-white font-semibold"> */}
          <button className="  text-green-700 font-bold bg-green-200 p-4 rounded-lg  ">
            + Create Course
          </button>
        </a>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Courses</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition duration-300"
          >
            <Link to={`/instructor/dashboard/editCourse/${course._id}`}>
            <img
              src={course.thumbnail}
              alt={course.thumbnail}
              className="w-full h-40 object-cover cursor-pointer"
              data-tooltip-id="edit-tooltip"
            />
            <Tooltip id="edit-tooltip" place="top" content="Edit Course" />
            </Link>
            <div className="p-4">
              <h3 className="text-center text-xl font-semibold text-green-800">
                {course.title}
              </h3>
              <h3 className="text-lg py-2  text-dark-green">
                {course.description}
              </h3>
              {/* <span className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${course.category.categoryName === 'Personal' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}> */}
              <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700 ">
                {course.category.categoryName}
              </span>
              <p className="mt-2 text-gray-600">
                <button className=" my-3 mx-2 rounded-md p-2 border text-white font-bold border-green-800 bg-green-800">Publish Course</button>
                <a href="/instructor/dashboard/addLesson"><button className="border my-3 rounded-md p-2 text-white font-bold border-blue-800 bg-blue-700 ">Add Lessons</button></a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorCourses;
