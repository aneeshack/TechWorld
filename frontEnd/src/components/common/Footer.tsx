const Footer = () => {
    return (
      <footer className="bg-green-950 text-white py-6">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* About Section */}
            <div>
              <h4 className="font-semibold text-lg">About Us</h4>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:text-gray-300">Our Mission</a></li>
                <li><a href="#" className="hover:text-gray-300">Careers</a></li>
                <li><a href="#" className="hover:text-gray-300">Contact Us</a></li>
                <li><a href="#" className="hover:text-gray-300">Privacy Policy</a></li>
              </ul>
            </div>
  
            {/* Courses Section */}
            <div>
              <h4 className="font-semibold text-lg">Explore Courses</h4>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:text-gray-300">Web Development</a></li>
                <li><a href="#" className="hover:text-gray-300">Data Science</a></li>
                <li><a href="#" className="hover:text-gray-300">Design & UX</a></li>
                <li><a href="#" className="hover:text-gray-300">Marketing</a></li>
              </ul>
            </div>
  
            {/* Instructors Section */}
            <div>
              <h4 className="font-semibold text-lg">Our Instructors</h4>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:text-gray-300">Become an Instructor</a></li>
                <li><a href="#" className="hover:text-gray-300">Instructor Dashboard</a></li>
                <li><a href="#" className="hover:text-gray-300">Teaching Resources</a></li>
              </ul>
            </div>
  
            {/* Support Section */}
            <div>
              <h4 className="font-semibold text-lg">Support</h4>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:text-gray-300">FAQ</a></li>
                <li><a href="#" className="hover:text-gray-300">Live Chat</a></li>
                <li><a href="#" className="hover:text-gray-300">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-300">Community Forum</a></li>
              </ul>
            </div>
          </div>
  
          <div className="mt-6 text-center">
            <p className="text-sm">© 2025 Your E-Learning Platform. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  