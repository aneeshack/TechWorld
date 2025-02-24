import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CLIENT_API } from '../../utilities/axios/Axios';
import { ICourse } from '../../types/ICourse';


const CourseDetailsPage =()=> {

  const {courseId}= useParams();
  const [courseDetail, setCourseDetail] = useState<ICourse|null>(null);

  useEffect(() => {
      if (courseId) {
        CLIENT_API.get(`/user/course/${courseId}`)
          .then((response) => {
            console.log('response',response.data.data)
            setCourseDetail(response.data.data);
          })
          .catch((error) => console.error("Error fetching course", error));
      }
    }, [courseId]);

  return (
    <div className="container mx-auto p-6 text-blue-700">
      {/* Course Header */}
      <div className="bg-blue-100 p-6 rounded-lg">
        <h1 className="text-2xl font-semibold">{courseDetail?.title}</h1>
      </div>
      
      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Video Section */}
        <div className="col-span-8 bg-white p-4 shadow rounded-lg">
          <img src={courseDetail?.thumbnail} alt="Course Video" className="w-full rounded-lg" />
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
            {/* {courseDetail?.lessons && courseDetail.lessons.length>0 ?( */}
            {courseDetail?.lessons?.length ?(
              courseDetail.lessons.map((lesson)=>(
                <div key={lesson._id} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                <img src={lesson.thumbnail} alt="Thumbnail" className="w-16 h-16 rounded-lg" />
                <div>
                  <h3 className="text-sm font-semibold"> {lesson.lessonNumber} {lesson.title}</h3>
                  <p className="text-xs text-gray-500">6:45</p>
                </div>
              </div>
              ))
            ):(
              <p className="text-gray-500 text-sm">No lessons available</p>
            )}
          </div>
          
          <h2 className="text-lg font-semibold mt-4">Price</h2>
          <p className="text-green-600 font-bold">{courseDetail?.price}</p>
          
          <h2 className="text-lg font-semibold mt-4">Instructor</h2>
          <p className="text-gray-600">{courseDetail?.instructor?.userName}</p>
          
          <h2 className="text-lg font-semibold mt-4">Course Info</h2>
          <ul className="text-gray-600 text-sm">
            <li>Duration: {courseDetail?.duration}</li>
            <li>Language: {courseDetail?.language}</li>
          </ul>
          <Link to={`/checkout/${courseDetail?._id}`}>
          <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg">Purchase Course</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default CourseDetailsPage;