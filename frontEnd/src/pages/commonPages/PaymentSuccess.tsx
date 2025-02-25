import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { toast } from "react-toastify";
import paymentSuccess from'../../assets/commonPages/paymentSuccess.webp'
import { deleteObject, getObject } from "../../utilities/LocalStorage";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (sessionId) {
            CLIENT_API.get(`/user/payment/status/${sessionId}`)
                .then(async (response) => {
                    if (response.data?.success) {
                        const paymentSession = getObject("payment_session");
                        console.log('payment get object',paymentSession)
                        
                        const enrollmentData = {
                            userId: paymentSession.userId,
                            courseId: paymentSession.courseId,
                            completionStatus: "enrolled",
                            amount:paymentSession.amount,
                            enrolledAt:paymentSession.enrolledAt,
                            sessionId: sessionId,
                          };
                  
                          console.log('enrolldata',enrollmentData)
                        const enrollResponse = await CLIENT_API.post('/user/course/enrolled',enrollmentData)

                        if (enrollResponse.data.success) {
                            toast.success("Payment successful! You are now enrolled.");
                            deleteObject("payment_session");
                            setTimeout(() => navigate("/student/dashboard"), 3000);
                          } else {
                            toast.error("Enrollment failed. Please contact support.");
                            navigate("/courses");
                          }

                    } else {
                        toast.error("Payment failed. Try again.");
                        navigate('/courses')
                    }
                })
                .catch(error => {
                    console.error("Payment verification failed", error);
                });
        }
    }, [sessionId]);

    return (
        <div className="flex justify-center items-center h-screen">
        <img src={paymentSuccess} alt="payment" className="w-44 h-44 lg:w-60 lg:h-60" />

        </div>
    )

};

export default PaymentSuccess;
