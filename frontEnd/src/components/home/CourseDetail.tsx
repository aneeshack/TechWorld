import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { CLIENT_API } from '../../utilities/axios/Axios';
import { ICourse } from '../../types/ICourse';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { IReview } from '../../types/IReview';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const [courseDetail, setCourseDetail] = useState<ICourse | null>(null);
  const user = useSelector((state: RootState) => state.auth.data);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<IReview[]>([]);

  useEffect(() => {
    if (courseId) {
      CLIENT_API.get(`/user/course/${courseId}`)
        .then((response) => {
          setCourseDetail(response.data.data);
        })
        .catch((error) => console.error("Error fetching course", error));
    }
  }, [courseId]);

  const handleFetchEnrollment = useCallback(async () => {
    try {
      if (user && user._id) {
        CLIENT_API.get(`/user/enrolled/${user._id}`)
          .then((response) => {
            if (response.data.success) {
              if (response.data?.data && Array.isArray(response.data.data)) {
                const isUserEnrolled = response.data.data.some(
                  (item: { courseId: string }) => item.courseId.toString() === courseId
                );
                if (isUserEnrolled) {
                  setIsEnrolled(true);
                }
              }
            }
          })
          .catch((error) => console.error("Error fetching course", error));
      }
    } catch (error: unknown) {
      console.error("Error fetching enrollment:", error);
    }
  }, [user, courseId]);

  useEffect(() => {
    if (user?._id && courseId) {
      handleFetchEnrollment();
    }
  }, [user?._id, courseId, handleFetchEnrollment]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await CLIENT_API.get(`/user/reviews/fetch/${courseId}`);
        setReviews(response.data.data); 
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    if (courseId) fetchReviews();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl  text-green-800 p-8 mb-10 animate-fade-in-down flex flex-col items-center justify-center text-center">
         <div className="absolute inset-0 opacity-20 z-0" />
           <h1 className="relative text-4xl font-extrabold z-10">
             {courseDetail?.title?.toUpperCase() || 'Loading Course...'}
           </h1>
           <p className="relative mt-2 text-black z-10 animate-fade-in-up animation-delay-200">
             Dive into an immersive learning experience!
           </p>
         </div>

        {/* Course Details Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-10 animate-fade-in-up animation-delay-300">
          {/* Thumbnail */}
          <div className="relative group mb-6">
            <img
              src={courseDetail?.thumbnail || 'https://via.placeholder.com/800x450'}
              alt="Course Thumbnail"
              className="w-full h-80 object-cover rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-2xl transition-opacity duration-300" />
          </div>

          {/* Course Overview */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Overview</h2>
          <p className="text-gray-700 leading-relaxed mb-6">

            {courseDetail?.description 
              ? courseDetail.description.charAt(0).toUpperCase() + courseDetail.description.slice(1)
              : 'No description available yet.'}          
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">Language</h3>
          <p className="text-gray-600 mb-6">{courseDetail?.language ? courseDetail.language?.charAt(0).toUpperCase()+courseDetail?.language.slice(1) :'Not specified'}</p>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">What You'll Learn</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our technology-focused courses are designed to help learners enhance their skills and stay ahead in the
            ever-evolving tech industry. Each course is structured to provide a comprehensive learning experience,
            covering essential concepts through well-organized lessons, interactive PDFs, and practical assessments.
            Start learning today and take a step toward mastering the latest technologies with our structured
            and engaging tech courses! 🚀
          </p>

          {/* Price, Instructor, and Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-200 pt-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Price</h3>
              <p className="text-2xl font-extrabold text-green-600">
                {courseDetail?.price ? `$${courseDetail.price}` : 'Free'}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instructor</h3>
              <p className="text-blue-600 text-lg">{courseDetail?.instructor?.userName ? courseDetail?.instructor?.userName?.charAt(0).toUpperCase()+courseDetail?.instructor?.userName.slice(1): 'TBA'}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Info</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li><span className="font-medium">Language:</span> {courseDetail?.language ? courseDetail.language?.charAt(0).toUpperCase()+courseDetail?.language.slice(1) :'Not specified'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-10 animate-fade-in-up animation-delay-400">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lessons</h2>
          {courseDetail?.lessons?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseDetail.lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  <img
                    src={lesson.thumbnail || 'https://via.placeholder.com/64'}
                    alt="Lesson Thumbnail"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      {lesson.lessonNumber}. {lesson.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{lesson?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4 animate-pulse">No lessons available yet</p>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-10 animate-fade-in-up animation-delay-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Average Rating</h3>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-gray-700 text-lg">
                {(courseDetail?.rating || 0).toFixed(1)} / 5
                {reviews.length > 0 && (
                  <span className="text-gray-500 ml-2">({reviews.length} reviews)</span>
                )}
              </span>
            </div>
          </div>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-yellow-500 ${i < (review.rating || 0) ? 'opacity-100' : 'opacity-30'}`}
                      >
                        ★
                      </span>
                    ))}
                    {/* <span className="text-gray-600 ml-2">{review.rating} / 5</span> */}
                  </div>
                  <p className="text-gray-700">{review.reviewText}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    By Student #{review.studentId?.userName} - 
                    {/* {new Date(review?.createdAt).toLocaleDateString()} */}
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Date not available'}
                    {/* By Student #{review.studentId?.userName} */}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No reviews yet.</p>
          )}
        </div>

        {/* Purchase/Learn Button */}
        <div className="text-center animate-fade-in-up animation-delay-500">
          {isEnrolled ? (
            <button
              onClick={() => navigate("/student/dashboard/courses")}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transform hover:scale-105 transition-all duration-300"
            >
              Learn Course
            </button>
          ) : (
            <Link to={`/checkout/${courseDetail?._id}`}>
              <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transform hover:scale-105 transition-all duration-300">
                Purchase Now
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;