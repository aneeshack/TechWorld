import { Route, Routes } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminHome from '../pages/admin/AdminHome'
import AdminInstructorRequest from '../pages/admin/AdminInstructorRequest'

const AdminRoutes = () => {
  return (
    <Routes>
        
        <Route path='dashboard/*' element={<AdminDashboard/>}>
        
        <Route index element={<AdminHome/>}/>
        <Route path='requests' element={<AdminInstructorRequest/>}/>
        
        </Route>
    </Routes>
  )
}

export default AdminRoutes