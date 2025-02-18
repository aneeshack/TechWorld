const courses = [
  { title: "Cooking class for your summer holiday", category: "Personal", lessons: 8, image: "https://via.placeholder.com/150" },
  { title: "Fundamentals of housing & ownership", category: "Personal", lessons: 8, image: "https://via.placeholder.com/150" },
  { title: "Hand lettering class the new wave victorian style", category: "Finance", lessons: 8, image: "https://via.placeholder.com/150" },
  { title: "Fundamentals of housing & ownership", category: "Personal", lessons: 8, image: "https://via.placeholder.com/150" },
  { title: "Hand lettering class the new wave victorian style", category: "Finance", lessons: 8, image: "https://via.placeholder.com/150" },
  { title: "Cooking class for your summer holiday", category: "Personal", lessons: 8, image: "https://via.placeholder.com/150" },
];

const InstructorCourses = () => {
  return (
    <div className="p-8 bg-dark-green min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-white font-bold">My Course</h2>
        <button className="border-2 border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-dark-green transition duration-300">
          + Create Course
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition duration-300"
          >
            <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-dark-green">{course.title}</h3>
              <span className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${course.category === 'Personal' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                {course.category}
              </span>
              <p className="mt-2 text-gray-600">{course.lessons} Lessons</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorCourses;
