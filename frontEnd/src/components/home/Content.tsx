import { useEffect, useState } from 'react';
import { CLIENT_API } from '../../utilities/axios/Axios';
import { ICourse } from '../../types/ICourse';

const Content = () => {
  const [courses, setCourses] = useState<ICourse[]>([])

  useEffect(() => {
      CLIENT_API.get("/user/allCourses")
        .then((response) => {
          console.log('response',response.data.data)
          setCourses(response.data.data);
        })
        .catch((error) => {
          console.log("API error", error);
        });
    }, []);
    
    return (
      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-center text-green-900">Explore Our Design Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
            {courses.length ===0 ? (
               <p className="text-center text-gray-500 text-xl">No courses found</p>
            ):(
             courses?.map((course)=>(
            <div key={course._id} className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img className="h-40 w-full object-cover rounded-md" src={course.thumbnail} alt="Graphic Design" />
              <h3 className="text-xl font-semibold mt-4 text-green-900">{course.title}</h3>
              <p className="text-gray-700 mt-2">{course.description}</p>
              <a href={`/courseDetail/${course._id}`} className="mt-4 inline-block text-green-900 hover:text-white hover:bg-green-600 hover:border-none px-4 py-2 rounded-md border border-green-900">Explore Course</a>
            </div>   
             ))
            )}
          </div>
        </div>
      </section>
    );
  }
  
  export default Content;
  