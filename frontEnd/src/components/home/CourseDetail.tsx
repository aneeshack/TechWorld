import Banner from '../../assets/commonPages/banner.webp'


const courseDetails = {
  title: "Maths - for Standard 3 Students | Episode 2",
  price: "$49.00",
  instructor: "Wade Warren",
  duration: "10 Days",
  lessons: "30",
  quizzes: "5",
  certificate: "Yes",
  language: "English",
  access: "Lifetime",
};

export default function CourseDetailsPage() {
  return (
    <div className="container mx-auto p-6 text-green-700">
      {/* Course Header */}
      <div className="bg-green-100 p-6 rounded-lg">
        <h1 className="text-2xl font-semibold">{courseDetails.title}</h1>
      </div>
      
      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Video Section */}
        <div className="col-span-8 bg-white p-4 shadow rounded-lg">
          <img src={Banner} alt="Course Video" className="w-full rounded-lg" />
          <h2 className="text-xl font-semibold mt-4">Course Details</h2>
          <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
          
          {/* <h2 className="text-lg font-semibold mt-4">Certification <Star className="inline text-yellow-500" /> <Star className="inline text-yellow-500" /> <Star className="inline text-yellow-500" /> <Star className="inline text-yellow-500" /> <Star className="inline text-yellow-500" /></h2> */}
          <p className="text-gray-600">Lorem ipsum dolor sit amet...</p>
          
          <h2 className="text-lg font-semibold mt-4">Who this course is for</h2>
          <p className="text-gray-600">Lorem ipsum dolor sit amet...</p>
          
          <h2 className="text-lg font-semibold mt-4">What you'll learn in this course:</h2>
          <ul className="list-disc ml-6 text-gray-600">
            <li>Lorem ipsum dolor sit amet...</li>
            <li>Lorem ipsum dolor sit amet...</li>
            <li>Lorem ipsum dolor sit amet...</li>
          </ul>
        </div>
        
        {/* Sidebar */}
        <div className="col-span-4 bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-semibold">Course Playlists</h2>
          <div className="mt-2 space-y-2">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                <img src={Banner} alt="Thumbnail" className="w-16 h-16 rounded-lg" />
                <div>
                  <h3 className="text-sm font-semibold">Maths - Episode {idx + 1}</h3>
                  <p className="text-xs text-gray-500">6:45</p>
                </div>
              </div>
            ))}
          </div>
          
          <h2 className="text-lg font-semibold mt-4">Price</h2>
          <p className="text-green-600 font-bold">{courseDetails.price}</p>
          
          <h2 className="text-lg font-semibold mt-4">Instructor</h2>
          <p className="text-gray-600">{courseDetails.instructor}</p>
          
          <h2 className="text-lg font-semibold mt-4">Course Info</h2>
          <ul className="text-gray-600 text-sm">
            <li>Duration: {courseDetails.duration}</li>
            <li>Lessons: {courseDetails.lessons}</li>
            <li>Quizzes: {courseDetails.quizzes}</li>
            <li>Certificate: {courseDetails.certificate}</li>
            <li>Language: {courseDetails.language}</li>
            <li>Access: {courseDetails.access}</li>
          </ul>
          
          <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg">Purchase Course</button>
        </div>
      </div>
    </div>
  );
}
