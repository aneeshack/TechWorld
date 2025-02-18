import { Route, Routes } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminHome from '../pages/admin/AdminHome'
import AdminInstructorRequest from '../pages/admin/AdminInstructorRequest'
import UserList from '../pages/admin/UserList'
import InstructorView from '../pages/admin/InstructorView'
import Categories from '../pages/admin/Categories'
import AddCategory from '../pages/admin/AddCategory'

const AdminRoutes = () => {

  return (
    <Routes>
        
        <Route path='dashboard/*' element={<AdminDashboard/>}>
        
        <Route index element={<AdminHome/>}/>
        <Route path='requests' element={<AdminInstructorRequest/>}/>
        <Route path='users' element={<UserList/>}/>
        <Route path='instructor/:id' element={<InstructorView/>}/>
        <Route path='categories' element={<Categories/>}/>
        <Route path='categories/add' element={<AddCategory/>}/>
        
        </Route>
    </Routes>
  )
}

export default AdminRoutes