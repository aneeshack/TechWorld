import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { ICourse, ILesson } from "../../types/ICourse";
import { toast } from "react-toastify";
import { IEnrollment } from "../../types/IEnrollment";
// import { useSelector } from "react-redux";

const CourseWatching = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<ILesson | null>(null);
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [courseCompletionPercentage, setCourseCompletionPercentage] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<IEnrollment>();

  useEffect(() => {
    if (!courseId) return;
    const fetchCourseData = async () => {
      try {
        const courseResponse = await CLIENT_API.get(`/student/course/${courseId}`);
        setCourse(courseResponse.data.data);
        
        const lessonsResponse = await CLIENT_API.get(`/student/lessons/${courseId}`);
        const fetchedLessons = lessonsResponse.data.data;
        setLessons(fetchedLessons);

        // Set the first lesson as the selected lesson if not already set
        if (fetchedLessons.length > 0) {
          setSelectedLesson(fetchedLessons[0]);
        }
        
        // Fetch enrollment data to get completion percentage
        const enrollmentResponse = await CLIENT_API.get(`/student/enrollment/${courseId}`);
        const enrollment = enrollmentResponse.data.data;
        setEnrollmentData(enrollment);
        
        // Set course completion percentage
        if (enrollment && enrollment.progress) {
          setCourseCompletionPercentage(enrollment.progress.overallCompletionPercentage);
          // Check if course is completed (e.g., if percentage is 100 or status is "completed")
          if (enrollment.completionStatus === "completed" || 
              enrollment.progress.overallCompletionPercentage >= 100) {
            setShowCertificate(true);
          }
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
      }
    };
  
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    if (!selectedLesson?._id) return;
    console.log('selected lesson pdf',selectedLesson?.pdf)

    const fetchPresignedUrl = async () => {
      try {
        const presignedResponse = await CLIENT_API.get(
          `/student/lesson/getPresignedUrlForVideo/${selectedLesson._id}`
        );
        const presignedUrl = presignedResponse.data.presignedUrl;
        setVideoSrc(presignedUrl);
      
        console.log("Fetched new presigned URL");
      
        refreshTimeout.current = setTimeout(fetchPresignedUrl, 270000);
      } catch (error) {
        console.error("Error fetching presigned URL:", error);
        toast.error("Unable to load video preview.");
      }
    };
      
    fetchPresignedUrl();
  
    return () => {
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    };
  }, [selectedLesson?._id]);

  const handleVideoProgress = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      const percentageWatched = (currentTime / duration) * 100;

      setWatchedPercentage(percentageWatched);

      if (percentageWatched >= 80) {
        updateLessonCompletion(selectedLesson!._id);
      }
    }
  };

  // API call to update lesson completion
  const updateLessonCompletion = async (lessonId: string) => {
    try {
      const response = await CLIENT_API.post(`/student/enrollment/updateProgress`, {
        courseId,
        lessonId,
      });
      
      console.log("Lesson marked as completed.");
      
      // Update the enrollment data with the new progress
      if (response.data.data) {
        setEnrollmentData(response.data.data);
        setCourseCompletionPercentage(response.data.data.progress.overallCompletionPercentage);
        
        // Check if course is now completed
        if (response.data.data.completionStatus === "completed" || 
            response.data.data.progress.overallCompletionPercentage >= 100) {
          setShowCertificate(true);
          toast.success("Congratulations! You've completed the course.");
        }
      }
    } catch (error) {
      console.error("Error updating lesson completion:", error);
    }
  };

  // Function to redirect to the chat page
  const openChatWithInstructor = () => {
    if (!course || !course.instructor) {
      toast.error("Instructor details not available.");
      return;
    }
    
    const chatUrl = `/student/dashboard/chat?courseId=${courseId}`;
    window.location.href = chatUrl;
  };

  // Function to redirect to the certificate page
  const viewCertificate = () => {
    if (!course) {
      toast.error("Course details not available.");
      return;
    }
    
    window.location.href = `/student/dashboard/certificate/${courseId}`;
  };

  return (
    <div className="container w-5/6 mx-auto p-6">
      {/* Course Header */}
      {course && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
          {/* Display instructor name */}
          <p className="text-gray-700 mt-2">
            <span className="font-semibold">Instructor:</span> {course.instructor?.userName || "Not specified"}
          </p>
          <img
            src={course?.thumbnail}
            alt="Course Thumbnail"
            className="w-full h-60 object-cover rounded-md mt-4"
          />
        </div>
      )}

      {/* Course Progress */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Course Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-600 h-4 rounded-full" 
            style={{ width: `${courseCompletionPercentage}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-600 mt-1">
          {courseCompletionPercentage.toFixed(0)}% Complete
        </p>
        
        {/* Certificate Button */}
        {showCertificate && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={viewCertificate}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
            >
              <span className="mr-2">🏆</span> View Course Certificate
            </button>
          </div>
        )}
      </div>

      {/* Video Player Section */}
      <div className="bg-white mt-8 shadow-md rounded-lg p-4 mb-6 flex flex-col items-center">
        {selectedLesson ? (
          <>
            <h2 className="text-2xl font-semibold mb-2">{selectedLesson?.lessonNumber}. {selectedLesson?.title}</h2>
            <p className="text-gray-600 mb-4">{selectedLesson?.description}</p>
            {videoSrc ? (
              <video
                ref={videoRef}
                src={videoSrc}
                controls
                className="w-5/6 h-96 rounded-lg"
                onTimeUpdate={handleVideoProgress}
              />
            ) : (
              <div className="w-full h-96 rounded-lg bg-gray-200 flex items-center justify-center">
                <p>Loading video...</p>
              </div>
            )}
            <p className="mt-2 text-gray-600">
              Watched: {watchedPercentage.toFixed(0)}%
            </p>
            {/* Chat with Instructor Button */}
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={() => openChatWithInstructor()}
            >
              💬 Chat with Instructor
            </button>
            
            {/* PDF Section */}
            {selectedLesson.pdf && (
              <div className="mt-4 flex flex-col items-start">
                {/* <h3 className="text-lg font-semibold text-gray-800 mb-2">Lesson Notes</h3>
                <p className="text-gray-600 mb-2">
                  Please download the PDF below to learn the content and review the notes:
                </p>
                <a
                  href={selectedLesson.pdf}
                  download
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Download PDF Notes
                </a> */}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-96 rounded-lg bg-gray-200 flex items-center justify-center">
            <p className="text-center text-gray-500">Select a lesson to watch</p>
          </div>
        )}
      </div>

      {/* Lesson List Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Lessons</h2>
        <ul>
          {lessons.map((lesson) => (
            <li
              key={lesson._id}
              className={`mb-4 last:mb-0 ${selectedLesson?._id === lesson._id ? "bg-blue-100" : ""} p-2 rounded`}
            >
              <div
                onClick={() => setSelectedLesson(lesson)}
                className="cursor-pointer hover:bg-gray-100 rounded flex items-center p-2"
              >
                <img 
                  className="w-7 h-7 mr-2" 
                  src={lesson.thumbnail} 
                  alt={lesson.title} 
                />
                <span>{lesson.lessonNumber}. {lesson.title}</span>
                
                {/* Add check mark for completed lessons */}
                {enrollmentData?.progress?.completedLessons?.includes(lesson._id) && (
                  <span className="ml-2 text-green-600">✓</span>
                )}
              </div>
              {lesson.assessment?.length ? (
                <div className="mt-2 ml-9">
                  <Link to={`/student/dashboard/assessment/${lesson._id}`}>
                    <button className="text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-blue-700 transition">
                      Take Assessment
                    </button>
                  </Link>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseWatching;