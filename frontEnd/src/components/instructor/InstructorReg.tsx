import { useFormik } from 'formik';
import background from '../../assets/instructor/background2.avif'
import { registerValidationSchema } from '../../utilities/validation/RegistrationSchema';
import { useAppDispatch } from '../../hooks/Hooks';
import { RegisterAction } from '../../redux/store/actions/instructor/RegisterAction';
import { Response } from '../../types/IForm';
import { toast } from 'react-toastify';
import { uploadToCloudinary } from '../../utilities/axios/UploadCloudinary';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CropModal from '../../pages/commonPages/CropModal';



const InstructorReg = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const user = useSelector((state:RootState)=>state.auth.data)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);


  const handleFileUpload = async(event: React.ChangeEvent<HTMLInputElement>)=>{
    const file = event.target.files?.[0]
    if(file){ 
        setImageToCrop(URL.createObjectURL(file)); // Set image for cropping     
    }
  }

  const handleCropComplete = async (croppedFile: File) => {
    try {
      setProfilePreview(URL.createObjectURL(croppedFile));
      const uploadedUrl = await uploadToCloudinary(croppedFile);
      formik.setFieldValue("profile.avatar", uploadedUrl);
      setImageToCrop(null); // Close modal after successful crop
    } catch (error) {
      console.error("Error uploading cropped image:", error);
      toast.error("Failed to upload cropped image. Please try again.");
    }
  };
 
  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = event.target.files?.[0];
    if (!file) {
        console.error("No file selected");
        return;
    }

    try {
        const fileUrl = await uploadToCloudinary(file);
        if (fileUrl) {
            console.log(`${fileType} uploaded successfully:`, fileUrl);
            formik.setFieldValue("cv", fileUrl);
        } else {
            console.error("Failed to upload file");
        }
    } catch (error) {
        console.error("Error uploading file:", error);
    }
};


  const formik = useFormik({
    initialValues: {
      _id:user?._id|| '',
      userName:user?.userName,
      profile:{
        dateOfBirth: '',
        avatar: null,
        profileDescription:'',
        gender: ''
      },
      contact: {
        phoneNumber:"",
        address: {
          street: '',
          city: '',
          state: '',
          country: '',
          pinCode: ''
        }
      },
      cv:'',
      experience:'',
      qualification:''

    },
    validationSchema: registerValidationSchema,
    onSubmit: async(values)=>{
      try {
        const result = await dispatch(RegisterAction({...values,_id:user?._id || ''}))
        const response = result.payload as Response;
        if(!response.success){
          if(response?.message){
            toast.error(response.message)
          }
        }
          navigate('/')
        
      } catch (error) {
          console.error('registration error:', error)
      }
    }

  })

  
    return (
        <div 
  className="container-fluid p-4 md:p-8 bg-cover bg-center" 
  style={{ backgroundImage: `url(${background})` }}
>
      <section className="container mx-auto mt-10 p-4 md:p-8 border-2 border-gray-100 shadow-lg bg-white rounded-lg max-w-3xl lg:max-w-5xl">
        <h2 className="text-2xl md:text-3xl text-green-900 font-bold mb-6 md:mb-10 text-center">Instructor Registration</h2>

        <div className="max-w-3xl mx-auto h-[500px] overflow-y-auto p-2">
        <form onSubmit={formik.handleSubmit} className="max-w-3xl mx-auto">
          
        <div className="mb-6">
            
            {profilePreview && (
              <div className='mt-4 flex justify-center'>
                <img src={profilePreview} alt="profile preview"
                className='w-40 h-40 object-cover rounded-full border' />
              </div>
            )}
          {imageToCrop && (
            <CropModal
              imageSrc={imageToCrop}
              onCropComplete={handleCropComplete}
              onClose={() => {
                URL.revokeObjectURL(imageToCrop);
                setImageToCrop(null);
              }}
            />
          )}
            <label className="block text-lg font-medium mb-2">Profile Picture</label>
            <input
              type="file"
              accept="image/jpeg, image/png, image/jpg"
              className="w-full p-3 border rounded-lg"
              onChange={handleFileUpload}
            />
           
            { formik.touched.profile?.avatar && formik.errors.profile?.avatar   ? (
              <div className='text-red-500 text-sm'>
                {formik.errors.profile?.avatar }
              </div>
            ): null}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={user?.userName}
              readOnly
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your full name"
            />
            { formik.touched.userName && formik.errors.userName ? (
              <div className='text-red-500 text-sm'>
                {formik.errors.userName}
              </div>
            ): null}
          </div>


          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Gender</label>
            <select
              {...formik.getFieldProps('profile.gender')}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formik.touched.profile?.gender && formik.errors.profile?.gender ? (
              <div className="text-red-500 text-sm">{formik.errors.profile?.gender}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Street</label>
            <input
              type="text"
              {...formik.getFieldProps('contact.address.street')}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter street address"
            />
            {formik.touched.contact?.address?.street && formik.errors.contact?.address?.street ? (
              <div className='text-red-500 text-sm'>{formik.errors.contact?.address?.street}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">City</label>
            <input
              type="text"
              {...formik.getFieldProps('contact.address.city')}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter city"
            />
            {formik.touched.contact?.address?.city && formik.errors.contact?.address?.city ? (
              <div className='text-red-500 text-sm'>{formik.errors.contact?.address?.city}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">State</label>
            <input
              type="text"
              {...formik.getFieldProps('contact.address.state')}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter state"
            />
            {formik.touched.contact?.address?.state && formik.errors.contact?.address?.state ? (
              <div className='text-red-500 text-sm'>{formik.errors.contact?.address?.state}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Country</label>
            <input
              type="text"
              {...formik.getFieldProps('contact.address.country')}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter country"
            />
            {formik.touched.contact?.address?.country && formik.errors.contact?.address?.country ? (
              <div className='text-red-500 text-sm'>{formik.errors.contact?.address?.country}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Pin Code</label>
            <input
              type="text"
              {...formik.getFieldProps('contact.address.pinCode')}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter zip code"
            />
            {formik.touched.contact?.address?.pinCode && formik.errors.contact?.address?.pinCode ? (
              <div className='text-red-500 text-sm'>{formik.errors.contact?.address?.pinCode}</div>
            ) : null}
          </div>


          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Email Address</label>
            <input
              type="text"
              value={user?.email}
              readOnly
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Phone Number</label>
            <input
              type="text"
              {...formik.getFieldProps('contact.phoneNumber')}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your phone number"
            />
            { formik.touched.contact?.phoneNumber && formik.errors.contact?.phoneNumber ? (
              <div className='text-red-500 text-sm'>
                {formik.errors.contact?.phoneNumber}
              </div>
            ): null}
          </div>
          
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              {...formik.getFieldProps('profile.dateOfBirth')}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your date of birth"
            />
            { formik.touched.profile?.dateOfBirth && formik.errors.profile?.dateOfBirth   ? (
              <div className='text-red-500 text-sm'>
                {formik.errors.profile?.dateOfBirth }
              </div>
            ): null}
          </div>
  
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Short Bio</label>
            <textarea
              className="w-full p-3 border rounded-lg"
              {...formik.getFieldProps('profile.profileDescription')}
              placeholder="Tell us a little about yourself"
            />
            { formik.touched.profile?.profileDescription && formik.errors.profile?.profileDescription   ? (
              <div className='text-red-500 text-sm'>
                {formik.errors.profile?.profileDescription }
              </div>
            ): null}
          </div>
  
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Upload CV</label>
            <input
              type="file"
              accept=".pdf, .doc, .docx"
              className="w-full p-3 border rounded-lg"
              onChange={(event)=> handleFile(event, 'cv')}
            />
             { formik.touched.cv && formik.errors.cv ? (
              <div className='text-red-500 text-sm'>
                {formik.errors.cv}
              </div>
            ): null}
          </div>
  
        
  
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Years of Experience</label>
            <input
              type="number"
              {...formik.getFieldProps('experience')}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your teaching experience in years"
            />
            { formik.touched.experience && formik.errors.experience ? (
              <div className='text-red-500 text-sm'>
                {formik.errors.experience}
              </div>
            ): null}
          </div>
  
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Qualification</label>
            <input
              type="text"
              {...formik.getFieldProps('qualification')}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter the skills you want to teach"
            />
            { formik.touched.qualification && formik.errors.qualification ? (
              <div className='text-red-500 text-sm'>
                {formik.errors.qualification}
              </div>
            ): null}
          </div>
            
          <button type='submit' className="bg-green-900 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg w-full" >
            Register as Instructor
          </button>
        </form>
        </div>
      </section>
      </div>
    );
  };
  
  export default InstructorReg;
  