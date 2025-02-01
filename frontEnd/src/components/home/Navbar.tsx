import logo from '../../assets/logo.png'

const Navbar = () => {
  return (
    <div>
        <nav className="bg-white border-b py-4">
  <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-8">
    <div className="relative flex h-16 items-center justify-between">
   
      <div className="flex items-center justify-start mr-10">
        <img className="h-16 w-auto" src={logo} alt="Your Company" />
      </div>

      <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">

        <div className="hidden sm:ml-6 sm:block">
          <div className="flex space-x-4">
            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50  hover:bg-green-700 hover:text-white">Home</a>
            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50  hover:bg-green-700 hover:text-white">Courses</a>
            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50  hover:bg-green-700 hover:text-white">Teach Us</a>
            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50  hover:bg-green-700 hover:text-white">Instructors</a>
            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50  hover:bg-green-700 hover:text-white">Contact Us</a>
          </div>
        </div>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      <a href="/signup?role=student" className="rounded-md hidden sm:block bg-green-900 px-3 py-2 mr-3 text-sm font-medium text-white" aria-current="page">Signup</a>
      <a href="#" className="rounded-md hidden sm:block bg-green-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Login</a>
      </div>

    </div>
  </div>
  <div className="sm:hidden" id="mobile-menu">
    <div className="space-y-1 px-2 pb-3 pt-2">
      {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
      <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" aria-current="page">Dashboard</a>
      <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
      <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>
      <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
    </div>
  </div>
</nav>
    </div>
  )
}

export default Navbar