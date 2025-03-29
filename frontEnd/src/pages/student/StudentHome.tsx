import { useEffect, useState } from "react";
import {
  Award,
  Book,
  Clock,
  Menu,
  PieChart,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { IEnrollment } from "../../types/IEnrollment";
import { Link } from "react-router-dom";

const StudentHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.data);
  const [enrollments, setEnrollments] = useState<IEnrollment[] | null>([]);
  const initialStats: Record<IEnrollment["completionStatus"], number> = {
    enrolled: 0,
    "in-progress": 0,
    completed: 0,
  };

  useEffect(() => {
    CLIENT_API.get(`/student/enrolled/${user?._id}`)
      .then((response) => {
        console.log("response", response.data.data);
        setEnrollments(response.data.data);
      })
      .catch((error) => console.error("Error fetching course", error));
  }, [user?._id]);

  const getStatusColor = (status: "enrolled" | "in-progress" | "completed") => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "enrolled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate total courses by status
  const courseStats = enrollments?.reduce((acc, enrollment) => {
    acc[enrollment?.completionStatus] =
      (acc[enrollment.completionStatus] || 0) + 1;
    return acc;
  }, initialStats);

  return (
    <div className="flex  bg-gray-50">
      <div className="lg:hidden fixed top-0 left-0 z-20 m-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Hello, {user?.userName}!
            </h1>
            <p className="mt-1 text-gray-600">
              Welcome back to your learning dashboard
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <Book size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">
                  Total Courses
                </h2>
                <p className="text-2xl font-semibold text-gray-800">
                  {enrollments?.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <PieChart size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Completed</h2>
                <p className="text-2xl font-semibold text-gray-800">
                  {courseStats?.completed || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                <Clock size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">
                  In Progress
                </h2>
                <p className="text-2xl font-semibold text-gray-800">
                  {(courseStats && courseStats["in-progress"]) || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-500">
                <Award size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">
                  Certificates Earned
                </h2>
                <p className="text-2xl font-semibold text-gray-800">
                  {courseStats?.completed || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="flex justify-center ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8  lg:w-[5000] max-w-6xl w-full">
          {/* Current Courses */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  My Courses
                </h3>
              </div>
              <div className="p-6">
                {enrollments && enrollments.length > 0 ? (
                  <div className="space-y-6">
                    {enrollments.map((enrollment) => (
                      <div
                        key={enrollment?._id}
                        className="flex flex-col md:flex-row border rounded-lg overflow-hidden"
                      >
                        <img
                          src={enrollment?.courseDetails?.thumbnail}
                          alt={enrollment?.courseDetails?.title}
                          className="w-full md:w-48 h-32 object-cover"
                        />
                        <div className="p-4 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <h4 className="text-lg font-semibold text-gray-800">
                              {enrollment?.courseDetails?.title}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                enrollment?.completionStatus
                              )}`}
                            >
                              {enrollment?.completionStatus
                                ?.charAt(0)
                                ?.toUpperCase() +
                                enrollment?.completionStatus?.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Instructor:{" "}
                            {enrollment?.courseDetails?.instructor?.userName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Category:{" "}
                            {enrollment?.courseDetails?.category?.categoryName}
                          </p>
                          <div className="mt-3">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${enrollment.progress.overallCompletionPercentage}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-700 ml-2">
                                {
                                  enrollment.progress
                                    .overallCompletionPercentage
                                }
                                %
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            Enrolled on{" "}
                            {enrollment?.enrolledAt
                              ? new Date(
                                  enrollment.enrolledAt
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : ""}
                              <Link to={`/student/dashboard/course/${enrollment?.courseId}`}>
                            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                              Continue Learning
                            </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    You haven't enrolled in any courses yet.
                  </p>
                )}
              </div>
              {/* <div className="px-6 py-3 border-t text-right">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-end"
                >
                  View all courses
                  <ChevronRight size={16} className="ml-1" />
                </a>
              </div> */}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
