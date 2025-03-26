import { useFormik } from "formik";
import { categoryValidationSchema } from "../../utilities/validation/CategoryValidation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CLIENT_API } from "../../utilities/axios/Axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {

  const [imagePreview, setImagePreview] = useState<string|null>(null)
  const [selectedFile, setSelectedFile] = useState<File|null>(null)
  const navigate = useNavigate()

  useEffect(()=>{
    return()=>{
      if(imagePreview){
        URL.revokeObjectURL(imagePreview)
      }
    }
  },[imagePreview])

  const formik = useFormik({
    initialValues:{
      categoryName: '',
      description: '',
    },
    validationSchema: categoryValidationSchema,
    onSubmit:async(values)=>{
      if(!selectedFile){
        toast.warn('Please select an image');
        return
      }

      try {
        const { data: { presignedUrl, imageUrl } } = await CLIENT_API.post('/admin/category/get-presigned-url', {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        });
  
        // Step 2: Upload file to S3
        await axios.put(presignedUrl, selectedFile, {
          headers: { 'Content-Type': selectedFile.type },
        });
  
        // Step 3: Submit category data with image URL
        await CLIENT_API.post('/admin/category/add', {
          ...values,
          imageUrl,  // Storing S3 image URL in the backend
        });
        navigate('/admin/dashboard/categories')
        toast.success('Category created successfully!');
      formik.resetForm();
      setImagePreview(null);
      setSelectedFile(null);
      } catch (error) {
        console.error('Error',error)
        toast.error('Error in creating category')
      }
    }
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
    const file = event.target.files?.[0];

    if(file){
      setSelectedFile(file);
      const previewUrl =URL.createObjectURL(file);
      setImagePreview(previewUrl)
    }else{
      setSelectedFile(null)
      setImagePreview(null)
    }
  }


    return (
    <div className="container mx-6 lg:mx-20 my-auto bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Category</h2>
  
      <form onSubmit={formik.handleSubmit}>
        {/* Category Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Category Name</label>
          <input 
            type="text" 
            {...formik.getFieldProps('categoryName')}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800" 
          />
          {formik.touched.categoryName && formik.errors.categoryName ? (
            <div className="text-red-500 text-sm">
              {formik.errors.categoryName}
            </div>
          ) : null}
        </div>
  
        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea 
            // rows="3"
            {...formik.getFieldProps('description')}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
          ></textarea>
           {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500 text-sm">
              {formik.errors.description}
            </div>
          ) : null}
        </div>
  
        {/* Upload Image */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Upload Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full"
          />
          {imagePreview && (
            <div className="mt-4">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-32 w-32 object-cover rounded-lg border"
              />
            </div>
          )}
          {!selectedFile && formik.submitCount>0 && (
             <div className="text-red-500 text-sm">Image is required</div>
          )}
        </div>
  

  
        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700">
            Create Category
          </button>
        </div>
      </form>
    </div>
    );
  };
  
  export default AddCategory;
  