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
    <div className="w-full flex h-screen">
      <AdminSidebar />
      <div className=" w-full flex flex-col min-h-screen">
      <NavbarDashboard/>
      <div className="flex-grow flex justify-center items-start overflow-auto ">
      <Outlet/>
        </div>
        
      <FooterDashboard/>
      </div>
    </div>
  )
}

export default AdminDashboard