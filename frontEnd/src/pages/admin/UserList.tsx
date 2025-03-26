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
    <div className="p-6 w-full mr-10">
      <h2 className="text-2xl font-semibold mb-6">User Management</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center border hover:bg-gray-50">
                <td className="px-4 py-2 border">{user.userName}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.role}</td>
                <td
                  className={`px-4 py-2 border font-semibold ${
                    user.isBlocked ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    className={`px-4 py-2 rounded-lg text-white font-medium ${
                      user.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                    }`}
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
