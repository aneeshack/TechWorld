import Banner from "../../components/home/Banner"
import Footer from "../../components/common/Footer"
import Navbar from "../../components/common/Navbar"
import Content from "../../components/home/Content"


const Home = () => {
  return (
    <div>
       <Navbar/>
       <Banner/> 
       <Content/>
       <Footer/>
    </div>
  )
}

export default Home