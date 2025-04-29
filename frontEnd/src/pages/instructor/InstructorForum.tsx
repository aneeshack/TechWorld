import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react'; 
import { CLIENT_API } from '../../utilities/axios/Axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ICourse } from '../../types/ICourse';

// ForumCard component with typed props
const ForumCard: React.FC<{ course: ICourse }> = ({ course }) => {
    return (
      <Link
        to={`/instructor/dashboard/forum/${course._id}`}
        className="block bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1"
      >
        <div className="p-4 flex items-start space-x-4">
          {/* Thumbnail and Forum Icon */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <img
              src={course?.thumbnail || ''}
              alt={course?.title || 'Course'}
              className="h-10 w-10 rounded-md object-cover"
            />
            <MessageSquare className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            {/* Course Name and Badge */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {course?.title || 'Untitled Course'}
              </h3>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                Forum
              </span>
            </div>
            {/* Description */}
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {course?.description || 'No description available'}
            </p>
            {/* Action Button */}
            <button className="mt-3 inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full hover:bg-indigo-700 transition-colors">
              Join Discussion
              <MessageSquare className="ml-1 h-3 w-3" />
            </button>
          </div>
        </div>
      </Link>
    );
  };


const InstructorForum: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state:RootState)=>state.auth.data);
    const [enrolledCourses, setEnrolledCourses] = useState<ICourse[]>([]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await CLIENT_API.get(
        `/instructor/allCourses`
      );
      console.log('response data',response.data.data)
      setEnrolledCourses(response.data.data);
    } catch (error) {
      console.error("Error fetching enrolled courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('enrolled cors', enrolledCourses);
  }, [enrolledCourses]);

  useEffect(() => {
    if (user?._id) {
      fetchCourses();
    }
  }, [user?._id,]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">My Course Forums</h1>
          <p className="mt-4 text-lg text-gray-600">
            Connect with peers and discuss topics related to your enrolled courses.
          </p>
        </div>
        {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ):enrolledCourses &&enrolledCourses.length>0 ?(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.length > 0 ? (
            enrolledCourses && enrolledCourses.map((course) => <ForumCard key={course._id} course={course} />)
          ) : (
            <p className="col-span-full text-center text-gray-500">No enrolled enrolledCourses found.</p>
          )}
        </div>

      ):
      <div className="flex justify-center py-10">
  <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
    <MessageSquare className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
    <h2 className="text-2xl font-semibold text-gray-800 mt-4">No Forums Found</h2>
    <p className="text-gray-600 mt-2">
      It looks like you haven't enrolled in any courses yet. Enroll in a course to join the discussion!
    </p>
    <Link
      to="/courseList"
      className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition-colors"
    >
      Explore Courses
    </Link>
  </div>
</div>
    }
      </div>
    </div>
  );
};

export default InstructorForum;