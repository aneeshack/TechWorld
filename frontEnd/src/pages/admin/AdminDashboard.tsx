import { Outlet } from "react-router-dom"
import AdminSidebar from "../../components/admin/AdminSidebar"
import FooterDashboard from "../../components/common/FooterDashboard"
import NavbarDashboard from "../../components/common/NavbarDashboard"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"


const AdminDashboard = () => {

  const user = useSelector((state:RootState)=>state.auth.data)
  console.log('role',user?.role)

  
  return (
    <div className="w-full flex align-middle">
      <AdminSidebar/>
      <div className="w-4/5 flex flex-col ">
      <NavbarDashboard/>
      <div className="flex-grow flex justify-center ">
      <Outlet/>
        </div>
        
      <FooterDashboard/>
      </div>
    </div>
  )
}

export default AdminDashboard