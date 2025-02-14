import { useEffect, useState } from "react";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { SignupFormData } from "../../types/IForm";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const UserList = () => {

    const [users, setUsers] = useState<SignupFormData[]>([])

    useEffect(()=>{
        CLIENT_API.get('/admin/users')
        .then((response)=>{
            console.log('response',response.data.data)
            setUsers(response.data.data)
        })
        .catch((error)=>{
            console.log('get users error',error)
        })
    },[])

    const changeStatus = (userId: string, isBlocked: boolean)=>{
      const status = isBlocked? 'unblock':'block'
      Swal.fire({
        title: `${status} user`,
        text:`Are you sure to ${status} the user?` ,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: isBlocked? "#28a745": '#d33',
        cancelButtonColor: "#d33",
        confirmButtonText:  `Yes, ${status}!`,
      })
      .then((result)=>{
        if(result.isConfirmed){
          CLIENT_API.patch(`/admin/user/${status}/${userId}`)
          .then((response)=>{
            console.log('response',response.data)
            if(response.data.success){
              console.log('respnse',response)
              setUsers((prevUsers)=>
                prevUsers.map((user)=>
                  user._id ===userId? {...user, isBlocked:!isBlocked}: user
                )
              )
              toast.success('user status updated')
            }
          })
          .catch((error)=>{
            console.log('user block unblock error',error)
          })
        }
      })
    }

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>User Management</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Role</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Status</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} style={{ textAlign: "center", border: "1px solid #ddd" }}>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.userName}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.email}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.role}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd", color: user.isBlocked === false ? "green" : "red" }}>{user.isBlocked ? "Block" : "Unblock"}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <button
                  style={{
                    padding: "8px 12px",
                    backgroundColor: user.isBlocked ? "green" : "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px"
                  }}
                  onClick={()=>changeStatus(user?._id ?? "", user?.isBlocked?? false)}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
