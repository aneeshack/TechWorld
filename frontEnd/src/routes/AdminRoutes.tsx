import { Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminHome from '../pages/admin/AdminHome'
import AdminInstructorRequest from '../pages/admin/AdminInstructorRequest'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Role } from '../types/IForm'
import UserList from '../pages/admin/userList'

const AdminRoutes = () => {
  const user = useSelector((state: RootState) => state.auth.data);
console.log('user',user?.role)
  if (!user || user?.role !== Role.Admin) {
    console.log('no user')
    return <Navigate to="/admin/login" />;
  }
  return (
    <Routes>
        
        <Route path='dashboard/*' element={<AdminDashboard/>}>
        
        <Route index element={<AdminHome/>}/>
        <Route path='requests' element={<AdminInstructorRequest/>}/>
        <Route path='users' element={<UserList/>}/>
        
        </Route>
    </Routes>
  )
}

export default AdminRoutes