import signup from '../../assets/auth/signup2.avif';

const LeftSection = () => {
  return (
      <div className="lg:w-1/2 relative w-full h-screen flex flex-col items-center justify-center bg-white">
      <div className='absolute top-4 left-4'>
      </div>
        <img src={signup} alt="signup" className="w-11/12 h-3/4 lg:w-[600px] object-cover" />
      </div>
  )
}

export default LeftSection

