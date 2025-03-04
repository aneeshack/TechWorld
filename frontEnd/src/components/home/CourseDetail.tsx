// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { useCallback, useEffect, useState } from 'react';
// import { CLIENT_API } from '../../utilities/axios/Axios';
// import { ICourse } from '../../types/ICourse';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store';

// const CourseDetailsPage = () => {
//   const { courseId } = useParams();
//   const [courseDetail, setCourseDetail] = useState<ICourse | null>(null);
//   const user = useSelector((state: RootState)=>state.auth.data)
//   const [ isEnrolled, setIsEnrolled]= useState(false)
//   const navigate = useNavigate()

//   useEffect(() => {
//     if (courseId) {
//       CLIENT_API.get(`/user/course/${courseId}`)
//         .then((response) => {
//           console.log('response', response.data.data);
//           setCourseDetail(response.data.data);
//         })
//         .catch((error) => console.error("Error fetching course", error));
//     }
//   }, [courseId]);

//   const handleFetchEnrollment = useCallback(async () => {
//       try {
//         if (user && user._id) {
//           CLIENT_API.get(`/user/enrolled/${user._id}`)
//               .then((response) => {
//                 if(response.data.success){
//                   console.log('response',response.data.data)
//                   if (response.data?.data && Array.isArray(response.data.data)) {
  
//                     const isUserEnrolled = response.data.data.some(
//                       (item: { courseId: string }) => item.courseId.toString() === courseId
//                     );
            
//                     if (isUserEnrolled) {
//                       setIsEnrolled(true);
//                     }
//                 }
//               }
//               })
//               .catch((error) => console.error("Error fetching course", error));
//         }
//       } catch (error: unknown) {
//         console.error("Error fetching enrollment:", error);
//       }
//     }, [user, courseId]);
  
//     useEffect(()=>{
//       if(user?._id && courseId){
//         handleFetchEnrollment()
//       }
//     },[user?._id, courseId, handleFetchEnrollment])

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">
   
//         <div className="relative overflow-hidden rounded-2xl text-green-700 p-8 mb-10 animate-fade-in-down flex flex-col items-center justify-center text-center">
//           <div className="absolute inset-0 opacity-20 z-0" />
//           <h1 className="relative text-4xl font-extrabold z-10">
//             {courseDetail?.title?.toUpperCase() || 'Loading Course...'}
//           </h1>
//           <p className="relative mt-2 text-black z-10 animate-fade-in-up animation-delay-200">
//             Dive into an immersive learning experience!
//           </p>
//         </div>
//         {/* Main Content Layout */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Left Column: Course Details */}
//           <div className="md:col-span-2 space-y-8">
//             {/* Thumbnail */}
//             <div className="relative group">
//               <img
//                 src={courseDetail?.thumbnail || 'https://via.placeholder.com/800x450'}
//                 alt="Course Thumbnail"
//                 className="w-full h-80 object-cover rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-500"
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-2xl transition-opacity duration-300" />
//             </div>

//             {/* Course Details */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg animate-fade-in-up animation-delay-300">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Overview</h2>
//               <p className="text-gray-700 leading-relaxed">
//                 {courseDetail?.description || 'No description available yet.'}
//               </p>

//               <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Language</h3>
//               <p className="text-gray-600">{courseDetail?.language || 'Not specified'}</p>

//               <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">What You'll Learn</h3>
//               <p className="text-gray-700 leading-relaxed">
//                 Our technology-focused courses are designed to help learners enhance their skills and stay ahead in the
//                 ever-evolving tech industry. Each course is structured to provide a comprehensive learning experience,
//                 covering essential concepts through well-organized lessons, interactive PDFs, and practical assessments.
//                  Start learning today and take a step toward mastering the latest technologies with our structured
//                 and engaging tech courses! 🚀
//               </p>
//             </div>
//           </div>

//           {/* Right Column: Sidebar */}
//           <div className="md:col-span-1">
//             <div className="bg-white rounded-2xl p-6 shadow-lg animate-fade-in-right animation-delay-400 sticky top-6">
//               {/* Course Playlists */}
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Lessons</h2>
//               <div className="space-y-4 max-h-96 overflow-y-auto">
//                 {courseDetail?.lessons?.length ? (
//                   courseDetail.lessons.map((lesson) => (
//                     <div
//                       key={lesson._id}
//                       className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-green-50 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
//                     >
//                       <img
//                         src={lesson.thumbnail || 'https://via.placeholder.com/64'}
//                         alt="Lesson Thumbnail"
//                         className="w-14 h-14 object-cover rounded-lg"
//                       />
//                       <div>
//                         <h3 className="text-sm font-medium text-gray-800">
//                           {lesson.lessonNumber}. {lesson.title}
//                         </h3>
//                         <p className="text-xs text-gray-500 line-clamp-1">{lesson?.description}</p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 text-sm text-center py-4 animate-pulse">
//                     No lessons available yet
//                   </p>
//                 )}
//               </div>

//               {/* Price */}
//               <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">Price</h2>
//               <p className="text-3xl font-extrabold text-green-600">
//                 {courseDetail?.price ? `$${courseDetail.price}` : 'Free'}
//               </p>

//               {/* Instructor */}
//               <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">Instructor</h2>
//               <p className="text-gray-600">{courseDetail?.instructor?.userName || 'TBA'}</p>

//               {/* Course Info */}
//               <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">Quick Info</h2>
//               <ul className="text-gray-600 text-sm space-y-1">
//                 <li>
//                   <span className="font-medium">Language:</span> {courseDetail?.language || 'N/A'}
//                 </li>
//               </ul>

//               {/* Purchase Button */}
//               {isEnrolled ? (
//                 <button
//                 onClick={()=>navigate("/student/dashboard/courses")}
//                 className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transform hover:scale-105 transition-all duration-300">
//                 Learn Course
//               </button>
//               ):(
//               <Link to={`/checkout/${courseDetail?._id}`}>
//                 <button className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transform hover:scale-105 transition-all duration-300">
//                   Purchase Now
//                 </button>
//               </Link>
//               )}
              
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseDetailsPage;
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { CLIENT_API } from '../../utilities/axios/Axios';
import { ICourse } from '../../types/ICourse';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const [courseDetail, setCourseDetail] = useState<ICourse | null>(null);
  const user = useSelector((state: RootState) => state.auth.data);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (courseId) {
      CLIENT_API.get(`/user/course/${courseId}`)
        .then((response) => {
          console.log('response', response.data.data);
          setCourseDetail(response.data.data);
        })
        .catch((error) => console.error("Error fetching course", error));
    }
  }, [courseId]);

  const handleFetchEnrollment = useCallback(async () => {
    try {
      if (user && user._id) {
        CLIENT_API.get(`/user/enrolled/${user._id}`)
          .then((response) => {
            if (response.data.success) {
              console.log('response', response.data.data);
              if (response.data?.data && Array.isArray(response.data.data)) {
                const isUserEnrolled = response.data.data.some(
                  (item: { courseId: string }) => item.courseId.toString() === courseId
                );
                if (isUserEnrolled) {
                  setIsEnrolled(true);
                }
              }
            }
          })
          .catch((error) => console.error("Error fetching course", error));
      }
    } catch (error: unknown) {
      console.error("Error fetching enrollment:", error);
    }
  }, [user, courseId]);

  useEffect(() => {
    if (user?._id && courseId) {
      handleFetchEnrollment();
    }
  }, [user?._id, courseId, handleFetchEnrollment]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl  text-green-800 p-8 mb-10 animate-fade-in-down flex flex-col items-center justify-center text-center">
         <div className="absolute inset-0 opacity-20 z-0" />
           <h1 className="relative text-4xl font-extrabold z-10">
             {courseDetail?.title?.toUpperCase() || 'Loading Course...'}
           </h1>
           <p className="relative mt-2 text-black z-10 animate-fade-in-up animation-delay-200">
             Dive into an immersive learning experience!
           </p>
         </div>

        {/* Course Details Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-10 animate-fade-in-up animation-delay-300">
          {/* Thumbnail */}
          <div className="relative group mb-6">
            <img
              src={courseDetail?.thumbnail || 'https://via.placeholder.com/800x450'}
              alt="Course Thumbnail"
              className="w-full h-80 object-cover rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-2xl transition-opacity duration-300" />
          </div>

          {/* Course Overview */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Overview</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {courseDetail?.description || 'No description available yet.'}
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">Language</h3>
          <p className="text-gray-600 mb-6">{courseDetail?.language || 'Not specified'}</p>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">What You'll Learn</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our technology-focused courses are designed to help learners enhance their skills and stay ahead in the
            ever-evolving tech industry. Each course is structured to provide a comprehensive learning experience,
            covering essential concepts through well-organized lessons, interactive PDFs, and practical assessments.
            Start learning today and take a step toward mastering the latest technologies with our structured
            and engaging tech courses! 🚀
          </p>

          {/* Price, Instructor, and Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-200 pt-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Price</h3>
              <p className="text-2xl font-extrabold text-green-600">
                {courseDetail?.price ? `$${courseDetail.price}` : 'Free'}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instructor</h3>
              <p className="text-gray-600">{courseDetail?.instructor?.userName || 'TBA'}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Info</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li><span className="font-medium">Language:</span> {courseDetail?.language || 'N/A'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-10 animate-fade-in-up animation-delay-400">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lessons</h2>
          {courseDetail?.lessons?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseDetail.lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  <img
                    src={lesson.thumbnail || 'https://via.placeholder.com/64'}
                    alt="Lesson Thumbnail"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      {lesson.lessonNumber}. {lesson.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{lesson?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4 animate-pulse">No lessons available yet</p>
          )}
        </div>

        {/* Purchase/Learn Button */}
        <div className="text-center animate-fade-in-up animation-delay-500">
          {isEnrolled ? (
            <button
              onClick={() => navigate("/student/dashboard/courses")}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transform hover:scale-105 transition-all duration-300"
            >
              Learn Course
            </button>
          ) : (
            <Link to={`/checkout/${courseDetail?._id}`}>
              <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transform hover:scale-105 transition-all duration-300">
                Purchase Now
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;