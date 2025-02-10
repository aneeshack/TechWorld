import { useEffect, useState } from "react";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { RequestStatus, SignupFormData } from "../../types/IForm";
import Swal from 'sweetalert2'
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/Hooks";
import { updateRequestStatus } from "../../redux/store/slices/UserSlice";
import { store } from "../../redux/store";
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
        Swal.fire({
          title: "Are you sure?",
          text: "Once approved, this user will become an Instructor!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, approve!",
        }).then((result)=>{

          if(result.isConfirmed){

            CLIENT_API.patch(`/admin/request/approve/${userId}`)
            .then((response) => {
              console.log('response',response.data)

              if(response.data.success){
                setRequests((prevRequests)=>prevRequests.filter((user)=>user._id !==userId))
                toast.success('user approved successfully')
                dispatch(updateRequestStatus(RequestStatus.Approved))
                console.log("Updated Redux State:", store.getState().auth.data);

              }
              
            })
            .catch((error) => {
            console.log('api error',error)
            });

          }
        })
      }


       const handleReject= (userId: string)=>{
        Swal.fire({
          title: "Are you sure?",
          text: "Once rejected, this user will not become an instructor.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, reject!",
        }).then((result) => {

          if(result.isConfirmed){

            CLIENT_API.patch(`/admin/request/reject/${userId}`)
            .then((response) => {
              
              console.log('response',response.data)
              if(response.data.success){
                setRequests((prevRequests)=>prevRequests.filter((user)=>user._id !==userId))
                toast.error('instructor request rejected')
                dispatch(updateRequestStatus(RequestStatus.Rejected))
              }
              
            })
            .catch((error) => {
            console.log('api error',error)
            });
           }
        })
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
