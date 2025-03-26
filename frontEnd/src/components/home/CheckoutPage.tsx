import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ICourse } from "../../types/ICourse";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { env } from "../../common/env";
import { loadStripe } from "@stripe/stripe-js";
import { storeObject } from "../../utilities/LocalStorage";

const CheckoutPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.data);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (courseId) {
      CLIENT_API.get(`/user/course/${courseId}`)
        .then((response) => {
          setCourse(response.data.data);
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

  const handlePayment = async () => {
    try {
      setLoading(true); // Start loading
      if (!course || !course._id) {
        toast.error('No course found');
        return;
      } else if (!course.title || !course._id || !course.thumbnail || !course.price) {
        toast.error('Some of the course details are missing');
        return;
      }

      const stripe = await loadStripe(env.STRIPE_PUBLIC_KEY);
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const sessionData = {
        courseName: course?.title,
        courseThumbnail: course?.thumbnail,
        courseId: course._id,
        amount: course.price,
        userId: user?._id,
      };

      const response = await CLIENT_API.post('/user/payment/process', sessionData);
      if (!response.data || !response.data.success) {
        throw new Error('Something went wrong, try again!');
      }

      storeObject('payment_session', {
        ...response.data.data,
        amount: course?.price,
        courseId: course?._id,
        userId: user?._id,
        instructor: course.instructor._id,
        enrolledAt: new Date().toISOString(),
      });

      const session = response.data.data;
      const result = await stripe?.redirectToCheckout({ sessionId: session.sessionId });
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('error', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-green-800 text-center mb-6">
          Checkout
        </h1>

        {/* Course Summary */}
        <div className="bg-green-50 p-6 rounded-lg mb-6 shadow-inner">
          <div className="flex items-center space-x-4">
            <img
              src={course?.thumbnail || 'https://via.placeholder.com/80'}
              alt="Course Banner"
              className="w-20 h-20 rounded-lg object-cover border-2 border-green-200"
            />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-800">
                {course?.title || 'Loading...'}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-2">
                {course?.description || 'No description available'}
              </p>
              <p className="text-sm text-green-700">
                <span className="font-medium">Instructor:</span> {course?.instructor?.userName || 'N/A'}
              </p>
              <p className="text-xl font-bold text-green-600">
                ₹{course?.price || '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        {course && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-green-800 mb-3">Order Summary</h2>
            <div className="flex justify-between text-gray-700">
              <span>Course:</span>
              <span>{course.title}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-green-600 mt-2">
              <span>Total:</span>
              <span>₹{course.price}</span>
            </div>
          </div>
        )}

        {/* Button */}
        <div className="text-center">
          {isEnrolled ? (
            <button
              onClick={() => navigate("/student/dashboard")}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transform hover:scale-105 transition-all duration-300 focus:outline-none"
              disabled={loading}
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={handlePayment}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transform hover:scale-105 transition-all duration-300 focus:outline-none disabled:bg-green-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Complete Purchase'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;


