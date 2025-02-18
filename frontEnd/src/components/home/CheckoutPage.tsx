import { useState } from "react";

const CheckoutPage = ()=> {
  const course = {
    title: "Full-Stack Web Development",
    price: 4999,
    instructor: "John Doe",
    banner: "https://via.placeholder.com/800x400",
  };

  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  return (
    <div className="container mx-auto p-6 w-2xl lg:max-w-5xl">
      <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>

      {/* Course Summary */}
      <div className="bg-gray-100 p-4 rounded-lg flex items-center">
        <img
          src={course.banner}
          alt="Course Banner"
          className="w-20 h-20 rounded-lg object-cover mr-4"
        />
        <div>
          <h2 className="text-lg font-semibold">{course.title}</h2>
          <p className="text-gray-600">Instructor: {course.instructor}</p>
          <p className="text-green-600 font-bold mt-1">₹{course.price}</p>
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
        <p className="text-gray-700">Course: {course.title}</p>
        <p className="text-lg font-bold text-green-600 mt-1">
          Total: ₹{course.price}
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