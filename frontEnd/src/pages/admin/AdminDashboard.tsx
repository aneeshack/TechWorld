import { Outlet } from "react-router-dom"
import AdminSidebar from "../../components/admin/AdminSidebar"
import FooterDashboard from "../../components/common/FooterDashboard"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import NavbarDashboard from "../../components/common/NavbarDashboard"


const AdminDashboard = () => {

  const user = useSelector((state:RootState)=>state.auth.data)
  console.log('role',user?.role)

  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AdminSidebar />
      <div className=" flex-1 flex flex-col min-h-screen">
      <NavbarDashboard/>
      <main className="flex-1 overflow-y-auto pt-6">
      <Outlet/>
        </main>
        
      <FooterDashboard/>
      </div>
    </div>
  )
}

export default AdminDashboard