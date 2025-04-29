import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { ILesson } from "../../types/ICourse";


const LessonsList = () => {
  const { courseId } = useParams();
  const [lessons, setLessons]= useState<ILesson[]>([])

   useEffect(() => {
      console.log("Course ID:", courseId);
    }, [courseId]);
  
    useEffect(() => {
    CLIENT_API.get(`/instructor/lessons/${courseId}`)
    .then((response) => {
    setLessons(response.data.data);
    })
    .catch((error) => {
    console.error("Error fetching lessons", error);
    // toast.error("Failed to load lessons");
    });
      }, [courseId]);
  return (
    <div className="w-5/6 lg:w-5/6 mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Lessons</h2>
      <Link to={`/instructor/dashboard/lesson/${courseId}/add`}>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg mb-4">
        Add Lesson
      </button>
      </Link>
      <div className="bg-white p-4 shadow-md rounded-lg">
      {lessons.length > 0 ? (
          <ul>
            {lessons.map((lesson) => (
              <li
                key={lesson._id}
                className="flex justify-between items-center border-b p-2"
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail Image */}
                  <img
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  
                  {/* Lesson Details */}
                  <div>
                    <span className="block font-semibold">
                      Lesson {lesson.lessonNumber ?? "N/A"}: {lesson.title}
                    </span>
                  </div>
                </div>
                
                {/* Edit Button */}
                <Link to={`/instructor/dashboard/editLesson/${courseId}/${lesson._id}`}>
                <button className="bg-blue-600 text-white px-3 py-1 rounded-lg">
                  Edit
                </button>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No lessons added yet.</p>
        )}
      </div>
    </div>
  );
};

export default LessonsList;
