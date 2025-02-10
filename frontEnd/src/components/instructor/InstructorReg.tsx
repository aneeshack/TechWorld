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



const InstructorReg = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const user = useSelector((state:RootState)=>state.auth.data)

  const handleFileUpload = async(event: React.ChangeEvent<HTMLInputElement>,fieldName: string)=>{
    const file = event.target.files?.[0]
    if(file){
      try {
      const uploadedUrl = await uploadToCloudinary(file);
      formik.setFieldValue(fieldName, uploadedUrl)

      } catch (error) {
        console.error(`Error uploading ${fieldName}:`, error);
      toast.error(`Failed to upload ${fieldName}. Please try again.`);
      }
      
    }
  }
  const formik = useFormik({
    initialValues: {
      _id:user?._id|| '',
      userName:"",
      profile:{
        dateOfBirth: '',
        avatar: null,
        profileDescription:''
      },
      contact: {
        phoneNumber:"",
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
        }else{
          setTimeout(() => navigate('/'), 500); 
        }

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
        <form onSubmit={formik.handleSubmit} className="max-w-3xl mx-auto">
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Full Name</label>
            <input
              type="text"
              {...formik.getFieldProps('userName')}
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
              onChange={(event)=> handleFileUpload(event, 'cv')}
            />
             { formik.touched.cv && formik.errors.cv ? (
              <div className='text-red-500 text-sm'>
                {formik.errors.cv}
              </div>
            ): null}
          </div>
  
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Profile Picture</label>
            <input
              type="file"
              accept="image/jpeg, image/png, image/jpg"
              className="w-full p-3 border rounded-lg"
              onChange={(event)=>handleFileUpload(event, 'profile.avatar')}
            />
            { formik.touched.profile?.avatar && formik.errors.profile?.avatar   ? (
              <div className='text-red-500 text-sm'>
                {formik.errors.profile?.avatar }
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
  
          <button className="bg-green-900 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg w-full" type='submit'>
            Register as Instructor
          </button>
        </form>
      </section>
      </div>
    );
  };
  
  export default InstructorReg;
  