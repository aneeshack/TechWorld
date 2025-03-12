import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CLIENT_API } from "../../utilities/axios/Axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ICourse } from "../../types/ICourse";
import { SignupFormData } from "../../types/IForm";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const CourseCertificate = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<ICourse>();
  const [user, setUser] = useState<SignupFormData>();
  const [loading, setLoading] = useState(true);
  const [currentDate] = useState(new Date().toLocaleDateString());
  const student = useSelector((state:RootState)=>state.auth.data)

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch course data
        const courseResponse = await CLIENT_API.get(`/student/course/${courseId}`);
        setCourse(courseResponse.data.data);
        
        // Fetch user data
        if(student && student._id){
          const userResponse = await CLIENT_API.get(`/student/profile/${student._id}`);
          setUser(userResponse.data.data);
        }
        
      } catch (error) {
        console.error("Error fetching certificate data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId,student]);

  const downloadCertificate = () => {
    const certificateElement = document.getElementById('certificate');
    if (!certificateElement) return;

    html2canvas(certificateElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`${user?.userName}-${course?.title}-Certificate.pdf`);
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Course Completion Certificate</h1>
        <button 
          onClick={downloadCertificate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Download Certificate
        </button>
      </div>

      {/* Certificate Design */}
      <div id="certificate" className="border-8 border-double border-blue-800 p-8 bg-white shadow-lg mx-auto" style={{ maxWidth: '900px', minHeight: '600px' }}>
        <div className="flex justify-center mb-4">
          <img src={course?.thumbnail} alt="Logo" className="h-16" />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-blue-800 mb-2">Certificate of Completion</h2>
          <p className="text-xl text-gray-600">This certifies that</p>
        </div>
        
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold italic text-gray-800 border-b-2 border-gray-300 inline-block px-8 py-2">
            {user?.userName?.toUpperCase() || "Student Name"}
          </h3>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-xl text-gray-600">has successfully completed the course</p>
          <h3 className="text-2xl font-bold text-blue-800 mt-2">
            {course?.title?.toUpperCase() || "Course Title"}
          </h3>
          <p className="text-lg text-gray-700 mt-1">
            {course?.description?.substring(0, 100) || "Course Description"}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mt-12">
          <div className="text-center">
            <div className="border-t-2 border-gray-300 pt-2 inline-block">
              <p className="font-bold">{course?.instructor?.userName || "Instructor Name"}</p>
              <p className="text-gray-600">Course Instructor</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="border-t-2 border-gray-300 pt-2 inline-block">
              <p className="font-bold">{currentDate}</p>
              <p className="text-gray-600">Date of Completion</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">Certificate ID: {courseId?.substring(0, 8)}-{user?._id?.substring(0, 8)}</p>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <p className="text-gray-600">This certificate verifies that the above-named individual has successfully completed all requirements for the course.</p>
      </div>
    </div>
  );
};

export default CourseCertificate;