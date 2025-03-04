import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../redux/store";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { IEnrollment } from "../../types/IEnrollment";

const StudentCourses = () => {

  const user = useSelector((state: RootState)=>state.auth.data)
    const [enrolledCourses, setEnrolledCourses] = useState<IEnrollment[]|null>([]);

  useEffect(()=>{
     CLIENT_API.get(`/user/enrolled/${user?._id}`)
          .then((response) => {
            console.log('response',response.data.data)
            setEnrolledCourses(response.data.data);
          })
          .catch((error) => console.error("Error fetching course", error));
  },[user?._id])

  return (
    <div className="p-8 my-5 mx-5 shadow-lg ">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Enrolled Courses</h2>
      </div>

      {enrolledCourses && enrolledCourses.length >0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        { enrolledCourses.map((course) => (
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
              <p className="text-sm text-gray-600 mt-2">{course.courseDetails?.description}</p>
              {/* <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                {course.category.categoryName}
              </span> */}
              <div className="mt-3">
                {/* <p className="text-gray-700 font-medium">
                  Progress:{" "}
                  <span className="text-green-600 font-semibold">
                    {course.progress}
                  </span>
                </p> */}
              </div>
              <div className="mt-4 flex justify-center">
                <Link to={`/student/course/${course.courseId}`}>
                  <button className="border rounded-md px-4 py-2 text-white font-bold bg-blue-600 hover:bg-blue-700 transition">
                    Continue Learning
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      ):(
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold text-gray-600">No Enrolled Courses</h3>
          <p className="text-gray-500 mt-2">
            You haven’t enrolled in any courses yet. Explore available courses to get started!
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
