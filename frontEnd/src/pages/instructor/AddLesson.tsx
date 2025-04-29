import { useEffect, useRef, useState } from "react";
import { uploadToCloudinary } from "../../utilities/axios/UploadCloudinary";
import { useFormik } from "formik";
import { lessonValidationSchema } from "../../utilities/validation/LessonValidation";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CLIENT_API } from "../../utilities/axios/Axios";
import axios from "axios";
import { ILesson } from "../../types/ICourse";

const AddLesson = () => {
  const [videoSrc, setVideoSrc] = useState<string|null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [isEditing, setIsEditing] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const { courseId, lessonId } = useParams(); 
  const navigate = useNavigate();
  const refreshTimeout = useRef<NodeJS.Timeout | number | null>(null);

  useEffect(() => {
    console.log("Course ID:", courseId);
  }, [courseId]);

  useEffect(() => {

    const fetchLessonAndVideo = async () => {
      if (!lessonId) return;

      try {
        setIsEditing(true)
        const response = await CLIENT_API.get(`/instructor/lesson/${lessonId}`);
        const lessonData = response.data.data;
        
        setLesson(lessonData);
        formik.setValues({
          title: lessonData.title,
          thumbnail: lessonData.thumbnail,
          pdf: lessonData.pdf,
          description: lessonData.description,
          video: lessonData.video,
          course: lessonData.course,
        });
        setThumbnailPreview(lessonData.thumbnail)
        // Fetch presigned URL for the video
        if (lessonData.video) {
          await fetchPresignedUrl();
        }
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    };

    const fetchPresignedUrl = async () => {
      try {
        const presignedResponse = await CLIENT_API.get(
          `/instructor/lesson/getPresignedUrlForVideo/${lessonId}`
        );
        const presignedUrl = presignedResponse.data.presignedUrl;
        setVideoSrc(presignedUrl);

        console.log("Fetched new presigned URL");

        // Set a timeout to refresh URL before expiry (270 seconds = 4m 30s)
        refreshTimeout.current = setTimeout(fetchPresignedUrl, 270000);
      } catch (error) {
        console.error("Error fetching presigned URL:", error);
        toast.error("Unable to load video preview.");
      }
    };

    fetchLessonAndVideo();

    // Cleanup timeout on unmount
    return () => {
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    };
  }, [lessonId]);


  const formik = useFormik({
    initialValues: {
      title: "",
      thumbnail: '',
      pdf: "",
      description: "",
      video: '',
      course: courseId || ''
    },
    validationSchema: lessonValidationSchema,
    onSubmit: async (values) => {
      console.log('submitting values',values);

      let videoUrl = values.video
      if(videoFile){
         videoUrl = await uploadVideoToS3();
         console.log('video url in formik',videoUrl)
         if(!videoUrl){
           toast.error('Video upload failed. Please try again')
           return
         }
         formik.setFieldValue('video', videoUrl);
      }
     
      
      try {
        if(isEditing){
          await CLIENT_API.put(`/instructor/lesson/${lessonId}`, {
            ...values,
            video: videoUrl,
          });
          navigate(`/instructor/dashboard/lessons/${courseId}`)
          toast.success("Lesson updated successfully!")
        }else{
          const response =await CLIENT_API.post(`/instructor/lesson/add`,{
            ...values,
            video: videoUrl
          })
          const newLessonId = response.data?.data?.lessonId;

      if (newLessonId) {
        navigate(`/instructor/dashboard/addAssessment/${newLessonId}`);
        toast.success("Lesson added successfully!");
      } else {
        toast.error("Lesson created, but no ID received.");
      }
          // navigate(`/instructor/dashboard/lessons/${courseId}`)
          // toast.success('Lesson added successfully!')
        }

        formik.resetForm();
        setVideoSrc(null);
        setThumbnailPreview(null)
        setVideoFile(null)
      } catch (error) {
        console.error("Error submitting lesson:", error);
        alert("Failed to add lesson. Please try again.");
      }

    },
  });

  const handleFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: 'thumbnail' | 'pdf'
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const fileUrl = await uploadToCloudinary(file);
      if (fileUrl) {
        console.log(`${fileType} uploaded successfully:`, fileUrl);

        if(fileType === 'thumbnail'){
          setThumbnailPreview(fileUrl)
        }
        formik.setFieldValue(fileType, fileUrl);
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleVideoFile = (event: React.ChangeEvent<HTMLInputElement>)=>{
    const file = event.target.files?.[0];
    if(!file) return;

    setVideoFile(file);
    setVideoSrc(URL.createObjectURL(file))
  }
  
  const uploadVideoToS3 = async()=>{
    if(!videoFile){
      return null;
    }

    try {
      console.log('inside upload video')
      const { data } = await CLIENT_API.post('/instructor/lesson/getPresignedUrl',{
        fileName: videoFile.name,
        fileType: videoFile.type
      })

      const { presignedUrl, videoUrl}= data;

      await axios.put(presignedUrl,videoFile,{
        headers:{'Content-Type': videoFile.type}
      })
      console.log('video url in video s3',videoUrl)
      return videoUrl;
      
    } catch (error) {
      console.error("Error uploading video:", error);
      return null;
    }
  }
 
  return (
    <div className="w-5/6 border shadow-lg mx-auto my-4 p-6">
      {isEditing ?(
        // <a href={`/instructor/dashboard/addAssessment/${lessonId}`} className="flex justify-end">
<a href={`/instructor/dashboard/${lesson?.assessment && lesson.assessment.length > 0 ? "editAssessment" : "addAssessment"}/${lessonId}`}>       
 <button className="border bg-indigo-700 p-4 rounded-lg text-white font-semibold">
           {/* Assessment */}
           {lesson?.assessment && lesson.assessment.length > 0 ? "Edit Assessment" : "Add Assessment"}
        </button>
      </a>
      ) :null}
      
      <h2 className="text-2xl font-bold mb-4">
        {isEditing? 'Edit Lesson' :'Add Lesson'}
      </h2>
      {/* <form onSubmit={formik.handleSubmit}> */}
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          

          {/* Lesson Thumbnail */}
          <div className="md:col-span-2">
           
            {thumbnailPreview && (
              <div className='mt-4 flex justify-center'>
                <img src={thumbnailPreview} alt="profile preview"
                className='w-40 h-40 object-cover rounded-md border' />
              </div>
            )}
             <label className="block text-sm font-medium text-gray-700">
              Lesson Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 w-full p-2 border rounded-lg"
              onChange={(event) => handleFile(event, "thumbnail")}
            />
              { formik.touched.thumbnail && formik.errors.thumbnail ? (
              <div className='text-red-500 text-sm'>
                {formik.errors.thumbnail}
              </div>
            ): null}
          </div>

          <div className="space-y-4 md:col-span-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lesson Title
              </label>
              <input
                type="text"
                {...formik.getFieldProps("title")}
                className="mt-1 w-full p-2 border rounded-lg"
                placeholder="Enter lesson title"
              />
              {formik.touched.title && formik.errors.title ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.title}
                </div>
              ) : null}
            </div>
          </div>
          {/* Lesson Attachments */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Lesson Attachments
            </label>
            <input 
            type="file" 
             accept=".pdf, .doc, .docx"
            className="mt-1 w-full p-2 border rounded-lg" 
            onChange={(event) => handleFile(event, "pdf")}
            />
             { formik.touched.pdf && formik.errors.pdf ? (
              <div className='text-red-500 text-sm'>
                {formik.errors.pdf}
              </div>
            ): null}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Lesson Description
          </label>
          <textarea
            className="mt-1 w-full p-2 border rounded-lg"
            placeholder="Enter lesson description"
            {...formik.getFieldProps('description')}
          ></textarea>
           {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 text-sm">{formik.errors.description}</div>
            ) : null}
        </div>

        {/* Lesson Resources */}
        {/* Lesson Video Upload */}
        <div className="mt-4">
          {videoSrc && (
            <div className="mt-2 flex items-center justify-center  h-40">
              <video controls className="h-full">
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <label className="block text-sm font-medium text-gray-700">
            Lesson Video
          </label>
          <input
            type="file"
            accept="video/*"
            className="mt-1 w-full p-2 border rounded-lg"
            onChange={handleVideoFile}
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {isEditing? 'Edit Lesson' :'Add Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLesson;
