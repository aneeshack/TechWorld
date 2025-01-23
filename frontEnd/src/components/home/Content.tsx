import course from '../../assets/banner.webp'
const Content = () => {
    return (
      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-center text-green-900">Explore Our Design Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
            
            {/* Course 1 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img className="h-40 w-full object-cover rounded-md" src={course} alt="Graphic Design" />
              <h3 className="text-xl font-semibold mt-4 text-green-900">Graphic Design Masterclass</h3>
              <p className="text-gray-700 mt-2">Learn the principles of design, typography, and how to create stunning graphics for print and digital media.</p>
              <a href="#" className="mt-4 inline-block text-green-900 hover:text-white hover:bg-green-600 px-4 py-2 rounded-md border border-green-900">Enroll Now</a>
            </div>
  
            {/* Course 2 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img className="h-40 w-full object-cover rounded-md" src={course} alt="UI/UX Design" />
              <h3 className="text-xl font-semibold mt-4 text-green-900">UI/UX Design Fundamentals</h3>
              <p className="text-gray-700 mt-2">Discover the basics of user interface and user experience design, creating intuitive and beautiful designs.</p>
              <a href="#" className="mt-4 inline-block text-green-900 hover:text-white hover:bg-green-600 px-4 py-2 rounded-md border border-green-900">Enroll Now</a>
            </div>
  
            {/* Course 3 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img className="h-40 w-full object-cover rounded-md" src={course} alt="Web Design" />
              <h3 className="text-xl font-semibold mt-4 text-green-900">Web Design for Beginners</h3>
              <p className="text-gray-700 mt-2">A beginner’s guide to web design, covering layout, responsiveness, and how to design websites from scratch.</p>
              <a href="#" className="mt-4 inline-block text-green-900 hover:text-white hover:bg-green-600 px-4 py-2 rounded-md border border-green-900">Enroll Now</a>
            </div>
  
            {/* Course 4 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img className="h-40 w-full object-cover rounded-md" src={course} alt="3D Design" />
              <h3 className="text-xl font-semibold mt-4 text-green-900">3D Design and Animation</h3>
              <p className="text-gray-700 mt-2">Master the art of 3D modeling and animation for games, movies, and virtual reality applications.</p>
              <a href="#" className="mt-4 inline-block text-green-900 hover:text-white hover:bg-green-600 px-4 py-2 rounded-md border border-green-900">Enroll Now</a>
            </div>
  
          </div>
        </div>
      </section>
    );
  }
  
  export default Content;
  