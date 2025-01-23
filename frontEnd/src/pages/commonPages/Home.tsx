import Banner from "../../components/home/Banner"
import Footer from "../../components/home/Footer"
import Navbar from "../../components/home/Navbar"
import Content from "../../components/home/content"


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