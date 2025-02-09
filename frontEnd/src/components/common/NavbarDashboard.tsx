import placeholder from '../../assets/commonPages/placeHolder.png';
import bell from '../../assets/commonPages/bell.avif'
const NavbarDashboard = () => {
  return (
    <div className=" h-[100px] flex justify-end items-center border border-b-gray-200 shadow-2xl">
      <div className="relative z-50 cursor-pointer pr-8">
        <div className="flex items-center w-[200px] gap-4 px-2 py-3 border border-gray-300 rounded-lg shadow-md cursor-pointer">
          <img src={placeholder} alt="Profile" className="w-12 h-12" />
          <p className="text-gray-900 font-semibold">aneesha</p>
          <img src={bell} alt="bell icon" className='w-12 h-12'/>
      </div>
        </div>
    </div>
  );
};

export default NavbarDashboard;
