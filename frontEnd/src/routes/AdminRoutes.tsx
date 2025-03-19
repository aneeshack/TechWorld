import { Route, Routes } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminHome from '../pages/admin/AdminHome'
import AdminInstructorRequest from '../pages/admin/AdminInstructorRequest'
import UserList from '../pages/admin/UserList'
import InstructorView from '../pages/admin/InstructorView'
import Categories from '../pages/admin/Categories'
import AddCategory from '../pages/admin/AddCategory'
import EditCategory from '../pages/admin/EditCategory'
import ErrorPage from '../pages/commonPages/ErrorPage'


const AdminRoutes = () => {

  return (
    <Routes>
        
        <Route path='dashboard/*' element={<AdminDashboard/>}>
        
        <Route index element={<AdminHome/>}/>
        <Route path='requests' element={<AdminInstructorRequest/>}/>
        <Route path='users' element={<UserList/>}/>
        <Route path='instructor/:id' element={<InstructorView/>}/>
        <Route path='categories' element={<Categories/>}/>
        <Route path='category/add' element={<AddCategory/>}/>
        <Route path='category/edit/:categoryId' element={<EditCategory/>}/>
        
        <Route path="*" element={<ErrorPage />} />
        </Route>
    </Routes>
  )
}

export default AdminRoutes