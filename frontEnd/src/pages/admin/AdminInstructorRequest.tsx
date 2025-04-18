import { useEffect, useState } from "react";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { RequestStatus, SignupFormData } from "../../types/IForm";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/Hooks";
import { updateRequestStatus } from "../../redux/store/slices/UserSlice";
import { store } from "../../redux/store";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const AdminInstructorRequest = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [requests, setRequests] = useState<SignupFormData[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<SignupFormData[]>([]);

  useEffect(() => {
    CLIENT_API.get("/admin/instructorRequests")
      .then((response) => {
        setRequests(response.data.data);
      })
      .catch((error) => {
        console.error("API error", error);
      });

    CLIENT_API.get("/admin/instructorRequests/rejected")
      .then((response) => {
        setRejectedRequests(response.data.data);
      })
      .catch((error) => {
        console.error("API error:", error);
      });
  }, []);

  const handleApprove = (userId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once approved, this user will become an Instructor!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve!",
    }).then((result) => {
      if (result.isConfirmed) {
        CLIENT_API.patch(`/admin/request/approve/${userId}`)
          .then((response) => {
            if (response.data.success) {
              setRequests((prevRequests) =>
                prevRequests.filter((user) => user._id !== userId)
              );
              toast.success("User approved successfully");
              dispatch(updateRequestStatus(RequestStatus.Approved));
              console.log("Updated Redux State:", store.getState().auth.data);
            }
          })
          .catch((error) => {
            console.error("API error", error);
          });
      }
    });
  };

  const handleReject = (userId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once rejected, this user will not become an instructor.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject!",
    }).then((result) => {
      if (result.isConfirmed) {
        CLIENT_API.patch(`/admin/request/reject/${userId}`)
          .then((response) => {
            if (response.data.success) {
              setRequests((prevRequests) =>
                prevRequests.filter((user) => user._id !== userId)
              );
              toast.error("Instructor request rejected");
              dispatch(updateRequestStatus(RequestStatus.Rejected));
            }
          })
          .catch((error) => {
            console.error("API error", error);
          });
      }
    });
  };

  return (
    <div className="my-10 mx-4 sm:mx-6 lg:mx-8 xl:mx-auto max-w-7xl">
      {requests.length > 0 ? (
        <>
          <h2 className="text-xl sm:text-2xl font-bold mb-6">
            Instructor Requests
          </h2>
          {/* Table for larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b text-left text-sm sm:text-base">
                    Name
                  </th>
                  <th className="py-3 px-4 border-b text-left text-sm sm:text-base">
                    Qualification
                  </th>
                  <th className="py-3 px-4 border-b text-left text-sm sm:text-base">
                    View Profile
                  </th>
                  <th className="py-3 px-4 border-b text-left text-sm sm:text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b text-sm sm:text-base">
                      {request.userName}
                    </td>
                    <td className="py-3 px-4 border-b text-sm sm:text-base">
                      {request.email}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <button
                        onClick={() =>
                          navigate(`/admin/dashboard/instructor/${request._id}`, {
                            state: { request },
                          })
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded flex items-center text-sm"
                      >
                        <EyeIcon className="h-5 w-5 mr-2" />
                        <span>View</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 border-b">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(request._id ?? "")}
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request._id ?? "")}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Card layout for mobile screens */}
          <div className="md:hidden space-y-4">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex flex-col space-y-2">
                  <div>
                    <span className="font-semibold">Name: </span>
                    <span>{request.userName}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Qualification: </span>
                    <span>{request.email}</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/dashboard/instructor/${request._id}`, {
                          state: { request },
                        })
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center text-sm"
                    >
                      <EyeIcon className="h-5 w-5 mr-2" />
                      View Profile
                    </button>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(request._id ?? "")}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex-1 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request._id ?? "")}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex-1 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 text-sm sm:text-base">
          No instructor requests found.
        </p>
      )}

      {/* Rejected Instructor Requests */}
      {rejectedRequests.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-red-500">
            Rejected Instructor Requests
          </h2>
          {/* Table for larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b text-left text-sm sm:text-base">
                    Name
                  </th>
                  <th className="py-3 px-4 border-b text-left text-sm sm:text-base">
                    Email
                  </th>
                  <th className="py-3 px-4 border-b text-left text-sm sm:text-base">
                    View Profile
                  </th>
                  <th className="py-3 px-4 border-b text-left text-sm sm:text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rejectedRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b text-sm sm:text-base">
                      {request.userName}
                    </td>
                    <td className="py-3 px-4 border-b text-sm sm:text-base">
                      {request.email}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <button
                        onClick={() =>
                          navigate(`/admin/dashboard/instructor/${request._id}`, {
                            state: { request },
                          })
                        }
                        className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded flex items-center text-sm"
                      >
                        <EyeIcon className="h-5 w-5 mr-2" />
                        <span>View</span>
                      </button>
                    </td>
                    <td>
                    <button
                        onClick={() => handleApprove(request._id ?? "")}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex-1 text-sm"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Card layout for mobile screens */}
          <div className="md:hidden space-y-4">
            {rejectedRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex flex-col space-y-2">
                  <div>
                    <span className="font-semibold">Name: </span>
                    <span>{request.userName}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Email: </span>
                    <span>{request.email}</span>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/admin/dashboard/instructor/${request._id}`, {
                        state: { request },
                      })
                    }
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center text-sm"
                  >
                    <EyeIcon className="h-5 w-5 mr-2" />
                    View Profile
                  </button>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInstructorRequest;