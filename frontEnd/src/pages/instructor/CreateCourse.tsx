import { useEffect, useState } from "react";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { CategoryEntity } from "../../types/ICategories";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { courseValidationSchema } from "../../utilities/validation/courseValidation";
import { Accept, useDropzone } from "react-dropzone";
import { uploadToCloudinary } from "../../utilities/axios/UploadCloudinary";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const CreateCourse = () => {
  const { courseId } = useParams(); 
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false)
  const instructor = useSelector((state: RootState) => state.auth.data);
  const navigate = useNavigate();

  useEffect(() => {
    if (courseId) {
      setIsEditing(true);
      CLIENT_API.get(`/instructor/course/${courseId}`)
        .then((response) => {
          const course = response.data.data;
          formik.setValues({
            title: course.title,
            description: course.description,
            thumbnail: course.thumbnail,
            instructor: course.instructor,
            category: course.category,
            price: course.price,
          });
          setImagePreview(course.thumbnail);
        })
        .catch((error) => console.error("Error fetching course", error));
    }
  }, [courseId]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      thumbnail: null,
      instructor: instructor?._id,
      category: "",
      price: "",
    },
    validationSchema: courseValidationSchema,
    onSubmit: async (values) => {
      console.log("values", values);
      if (isEditing) {
        // Update existing course
        CLIENT_API.put(`/instructor/course/edit/${courseId}`, values)
          .then((response) => {
            if (response.data.success) {
              console.log('id',response.data.data._id)
              navigate('/instructor/dashboard/courses')
              toast.success("Course updated successfully.");
            }
          })
          .catch((error) => console.error("Error updating course", error));
      } else {
    CLIENT_API.post(`/instructor/course/add`,values)
      .then((response) => {
        console.log("response", response.data.data._id);
        if (response.data.success) {
          const courseId = response.data.data._id
          navigate(`/instructor/dashboard/lesson/${courseId}/add`)
          toast.success("Course created successfully.");
        }
      })
      .catch((error) => {
        console.log("Error in creating course", error);
      });
    }
    },
  });

  const onDrop = async (acceptedFiles:File[]) => {
    console.log("File dropped:", acceptedFiles); // Check when files are added
  
    const file = acceptedFiles[0];
    if (!file) return;
  
    try {
      console.log("Uploading file to Cloudinary...");
      const cloudinaryUrl = await uploadToCloudinary(file);
      console.log("Uploaded image URL:", cloudinaryUrl);
      
      if (cloudinaryUrl) {
        setImagePreview(cloudinaryUrl)
        formik.setFieldValue("thumbnail", cloudinaryUrl);
      }
    } catch (error) {
      console.error("Cloudinary upload failed", error);
    }
  };

  const acceptTypes: Accept = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptTypes,
    multiple: false,
  });

  useEffect(() => {
    CLIENT_API.get("/instructor/fetchCategories")
      .then((response) => {
        console.log("reponse", response.data.data);
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.log("api error", error);
      });
  }, []);



  return (
    <div className="w-5xl lg:w-5/6 mx-auto p-6">
      {isEditing ?(
      <a href={`/instructor/dashboard/lessons/${courseId}`} className="flex justify-end">
      <button className="border bg-green-700 p-4 rounded-lg text-white font-semibold">
      Lessons
      </button>
      </a>
      ):null}
     
      <h2 className="text-2xl font-semibold mb-4">
        { isEditing? 'Edit Course': 'Create Course'}
      </h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Thumbnail */}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Thumbnail
            </label>
             <div
        {...getRootProps()}
        className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-52 lg:h-[400px] lg:w-[450px] cursor-pointer"
      >
        <input {...getInputProps()} />
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
        ) : (
          <span className="text-gray-400">Drag & drop an image here or click to upload</span>
        )}
      </div>
          {formik.touched.thumbnail && formik.errors.thumbnail ? (
              <div className="text-red-500 text-sm">{formik.errors.thumbnail}</div>
            ) : null}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course Title
              </label>
              <input
                type="text"
                {...formik.getFieldProps('title')}
                className="mt-1 w-full p-2 border rounded-lg"
                placeholder="Enter course title"
              />
                {formik.touched.title && formik.errors.title ? (
              <div className='text-red-500 text-sm'>{formik.errors.title}</div>
            ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...formik.getFieldProps('description')}
                className="mt-1 w-full p-2 border rounded-lg"
                placeholder="Enter course description"
              ></textarea>
                {formik.touched.description && formik.errors.description ? (
              <div className='text-red-500 text-sm'>{formik.errors.description}</div>
            ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formik.values.category}  
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}     
              className="mt-1 w-full p-2 border rounded-lg">
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {formik.touched.category && formik.errors.category ? (
              <div className='text-red-500 text-sm'>{formik.errors.category}</div>
            ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                {...formik.getFieldProps('price')}
                className="mt-1 w-full p-2 border rounded-lg"
                placeholder="Enter amount"
              />
               {formik.touched.price && formik.errors.price ? (
              <div className='text-red-500 text-sm'>{formik.errors.price}</div>
            ) : null}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">
          { isEditing? 'Update Course': 'Save Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
