import { Route, Routes } from "react-router-dom"
import UserRoutes from "./routes/UserRoutes"

const App = () => {
  return (
    <Routes>
      <Route path='/*' element={<UserRoutes/>}/>
    </Routes>
  )
}

export default App