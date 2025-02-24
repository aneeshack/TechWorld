import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ICourse } from "../../types/ICourse";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { env } from "../../common/env";
import { loadStripe } from '@stripe/stripe-js'


const stripePromise = loadStripe(env.STRIPE_PUBLIC_KEY)

const CheckoutPage = ()=> {

  const { courseId } = useParams();
  const [course, setCoure] = useState<ICourse|null>(null);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  // const [loading, setLoading ] = useState(false);


  
  useEffect(() => {
        if (courseId) {
          CLIENT_API.get(`/user/course/${courseId}`)
            .then((response) => {
              console.log('response',response.data.data)
              setCoure(response.data.data);
            })
            .catch((error) => console.error("Error fetching course", error));
        }
      }, [courseId]);

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
          <p className="text-gray-600">Instructor: {course?.instructor?.userName}</p>
          <p className="text-green-600 font-bold mt-1">₹{course?.price}</p>
        </div>
      </div>

      {/* Billing Details */}
      <div className="bg-white shadow p-4 rounded-lg mt-4">
        <h2 className="text-xl font-semibold mb-3">Billing Details</h2>
        <form className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded-md"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Billing Address"
            className="w-full p-2 border rounded-md"
          />
        </form>
      </div>

      {/* Payment Method */}
      <div className="bg-white shadow p-4 rounded-lg mt-4">
        <h2 className="text-xl font-semibold mb-3">Payment Method</h2>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="creditCard"
              checked={paymentMethod === "creditCard"}
              onChange={() => setPaymentMethod("creditCard")}
            />
            <span>Credit/Debit Card</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={() => setPaymentMethod("upi")}
            />
            <span>UPI</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
            />
            <span>PayPal</span>
          </label>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-green-100 p-4 rounded-lg mt-4">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <p className="text-gray-700">Course: {course?.title}</p>
        <p className="text-lg font-bold text-green-600 mt-1">
          Total: ₹{course?.price}
        </p>
      </div>

      {/* Checkout Button */}
      <button className="w-full bg-green-800 text-white py-3 rounded-lg mt-4 hover:bg-green-600">
        Complete Purchase
      </button>
    </div>
  );
}

export default CheckoutPage;