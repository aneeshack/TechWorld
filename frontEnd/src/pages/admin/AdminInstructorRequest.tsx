import { useEffect, useState } from "react";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { SignupFormData } from "../../types/IForm";
import { useAppDispatch } from "../../hooks/Hooks";
import { RequestApprovalAction } from "../../redux/store/actions/instructor/RequestApprovalAction";
import { RequestRejectAction } from "../../redux/store/actions/instructor/RequestRejectAction";

const AdminInstructorRequest = () => {

  const dispatch = useAppDispatch();

 

  const [requests, setRequests]= useState<SignupFormData[]>([])
    useEffect(() => {
          CLIENT_API.get('/admin/instructorRequests')
          .then((response) => {
            setRequests(response.data.data)
          })
          .catch((error) => {
          console.log('api error',error)
          });
      }, []);
      const handleApprove =(userId: string)=>{
        dispatch(RequestApprovalAction(userId)) 

       }
       const handleReject= (userId: string)=>{
        dispatch(RequestRejectAction(userId)) 

       }
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Instructor Requests</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b text-left">Name</th>
              <th className="py-3 px-4 border-b text-left">Qualification</th>
              <th className="py-3 px-4 border-b text-left">Short Bio</th>
              <th className="py-3 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{request.userName}</td>
                <td className="py-3 px-4 border-b">{request.email}</td>
                <td className="py-3 px-4 border-b">{request.profile?.profileDescription}</td>
                <td className="py-3 px- border-b">
                  <button onClick={()=>handleApprove(request._id?? "")} className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mr-2">
                    Approve
                  </button>
                  <button onClick={()=>handleReject(request._id?? "")}  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInstructorRequest;
