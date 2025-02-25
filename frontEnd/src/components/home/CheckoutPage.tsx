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


const CheckoutPage = ()=> {

  const { courseId } = useParams();
  const [course, setCourse] = useState<ICourse|null>(null);
  const [loading, setLoading ] = useState(false);
  const user = useSelector((state: RootState)=>state.auth.data)
  const [ isEnrolled, setIsEnrolled]= useState(false)
  const navigate = useNavigate();
  console.log('user',user)

  
  useEffect(() => {
        if (courseId) {
          CLIENT_API.get(`/user/course/${courseId}`)
            .then((response) => {
              console.log('response',response.data.data)
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
              if(response.data.success){
                console.log('response',response.data.data)
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

  useEffect(()=>{
    if(user?._id && courseId){
      handleFetchEnrollment()
    }
  },[user?._id, courseId, handleFetchEnrollment])


  const handlePayment =async()=>{
    try {
      if(!course || !course._id){
        toast.error('no course found')
        return
      }else if(
        !course.title || !course._id || !course.thumbnail ||!course.price
      ){
        toast.error('some of the course details is missing')
        return
      }

      console.log('env', env.STRIPE_PUBLIC_KEY);
      const stripe = await loadStripe(env.STRIPE_PUBLIC_KEY)

      if(!stripe){
        throw new Error('Stripe failed to load')
      }

      const sessionData ={
        courseName: course?.title,
        courseThumbnail:course?.thumbnail,
        courseId: course._id,
        amount: course.price,
        userId: user?._id
      }
      
      const response = await CLIENT_API.post('/user/payment/process', sessionData)
      if(!response.data || !response.data.success){
        throw new Error('Something went wrong, trye again!')
      }
      console.log('data form back',response.data.data)

      storeObject('payment_session',{
        ...response.data.data,
        amount: course?.price,
        courseId: course?._id,
        userId: user?._id,
        instructor:course.instructor._id,
        enrolledAt: new Date().toISOString()
      })

      const session = response.data.data;

      setLoading(false)
      const result = await stripe?.redirectToCheckout({sessionId: session.sessionId});
      if(result.error){
        throw new Error(result.error.message)
      }
    } catch (error) {
      console.log('error',error)
    }
  }
  return (
    <div className="container mx-auto p-6 w-2xl lg:max-w-5xl">
      

      <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>

      {/* Course Summary */}
      <div className="bg-gray-100 p-4 rounded-lg flex items-center">
        <img
          src={course?.thumbnail}
          alt="Course Banner"
          className="w-20 h-20 rounded-lg object-cover mr-4"
        />
        <div>
          <h2 className="text-lg font-semibold">{course?.title}</h2>
          <h2 className="text-sm py-1">{course?.description}</h2>
          <p className="text-blue-600"><span className="font-semibold">Instructor:</span> {course?.instructor?.userName}</p>
          <p className="text-green-600 font-bold mt-1">₹{course?.price}</p>
        </div>
      </div>

      {course && (
        <div className="bg-green-100 p-4 rounded-lg mt-4">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <p className="text-gray-700">Course: {course.title}</p>
          <p className="text-lg font-bold text-green-600 mt-1">
            Total: ₹{course.price}
          </p>
        </div>
      )}

      {/* Checkout Button */}
      {isEnrolled ? (
            <button
              onClick={()=>navigate("/student/dashboard")}
              className="px-6 py-3 w-full bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-500 focus:outline-none"
            >
              Go to Dashboard
            </button>
          ) : (
      <button onClick={handlePayment} className="w-full bg-green-800 text-white py-3 rounded-lg mt-4 hover:bg-green-600">
        {loading? 'processing...' : 'Complete Purchase'}
      </button>
          )}
    </div>
  );
}

export default CheckoutPage;