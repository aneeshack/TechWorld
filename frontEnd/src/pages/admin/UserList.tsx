import { useEffect, useState } from "react";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { SignupFormData } from "../../types/IForm";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const UserList = () => {
  const [users, setUsers] = useState<SignupFormData[]>([]);

  useEffect(() => {
    CLIENT_API.get("/admin/users")
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.error("get users error", error);
      });
  }, []);

  const changeStatus = (userId: string, isBlocked: boolean) => {
    const status = isBlocked ? "unblock" : "block";
    Swal.fire({
      title: `${status} user`,
      text: `Are you sure to ${status} the user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#28a745" : "#d33",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${status}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        CLIENT_API.patch(`/admin/user/${status}/${userId}`)
          .then((response) => {
            if (response.data.success) {
              setUsers((prevUsers) =>
                prevUsers.map((user) =>
                  user._id === userId ? { ...user, isBlocked: !isBlocked } : user
                )
              );
              toast.success("User status updated");
            }
          })
          .catch((error) => {
            console.error("User block/unblock error", error);
          });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6">User Management</h2>
      
      {/* Table Container */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left border-b font-semibold">Name</th>
              <th className="px-4 py-2 text-left border-b font-semibold hidden sm:table-cell">Email</th>
              <th className="px-4 py-2 text-left border-b font-semibold hidden md:table-cell">Role</th>
              <th className="px-4 py-2 text-left border-b font-semibold">Status</th>
              <th className="px-4 py-2 text-left border-b font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr 
                key={user._id} 
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">
                  <div className="sm:hidden">
                    <div>{user.userName}</div>
                    <div className="text-xs text-gray-600">{user.email}</div>
                    <div className="text-xs text-gray-600">{user.role}</div>
                  </div>
                  <div className="hidden sm:block">{user.userName}</div>
                </td>
                <td className="px-4 py-2 hidden sm:table-cell">{user.email}</td>
                <td className="px-4 py-2 hidden md:table-cell">{user.role}</td>
                <td className={`px-4 py-2 font-semibold ${
                  user.isBlocked ? "text-red-500" : "text-green-500"
                }`}>
                  {user.isBlocked ? "Blocked" : "Active"}
                </td>
                <td className="px-4 py-2">
                  <button
                    className={`w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-white font-medium text-sm sm:text-base
                      ${user.isBlocked 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "bg-red-500 hover:bg-red-600"
                      } transition-colors`}
                    onClick={() => changeStatus(user?._id ?? "", user?.isBlocked ?? false)}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
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

export default UserList;