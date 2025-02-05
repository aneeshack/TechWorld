import teach from '../../assets/teachus1.jpg'

const TeachBanner = () => {
  return (
    <div >
        <div className="w-full h-[50vh] bg-cover bg-center relative " style={{ backgroundImage:`url(${teach})` }}></div>
    </div>
  )
}

export default TeachBanner