import { useEffect, useState } from 'react';
import {  Calendar, Mail, Phone, Award, CheckCircle, AlertTriangle } from 'lucide-react';
import { CLIENT_API } from '../../utilities/axios/Axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { SignupFormData } from '../../types/IForm';
import profilePic from '../../assets/commonPages/placeHolder.png';
import { uploadToCloudinary } from '../../utilities/axios/UploadCloudinary';
import { FormErrors } from '../../types/formErrors';
import { useAppDispatch } from '../../hooks/Hooks';
import { useSocket } from '../../context/Sockets';
import { updateUserProfile } from '../../redux/store/slices/UserSlice';

const StudentProfile = () => {
  const user = useSelector((state: RootState) => state.auth.data);
  const [student, setStudent] = useState<SignupFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [formData, setFormData] = useState<Partial<SignupFormData>>({}); // Form state for editing
  const [avatarPreview, setAvatarPreview] = useState<string | null>((student?.profile?.avatar as string) || profilePic)
  const [errors, setErrors] = useState<FormErrors>({});
  const dispatch = useAppDispatch();
  const socket = useSocket();

  const validateForm =()=> {
    const newErrors :FormErrors ={};
    const phoneRegex = /^[0-9]{10}$/;
    if (isEditing) {
      // Qualification validation
      if (!formData.qualification?.trim()) {
        newErrors.qualification = 'Qualification is required';
      } else if (formData.qualification.length > 50) {
        newErrors.qualification = 'Qualification too long (max 50 characters)';
      }
  
      // Date of Birth validation
      if (formData.profile?.dateOfBirth) {
        const dobDate = new Date(formData.profile.dateOfBirth);
        const today = new Date();
        if (dobDate > today) {
          newErrors.dateOfBirth = 'Date of birth cannot be in the future';
        }
      }
  
      // Gender validation
      if (!formData.profile?.gender) {
        newErrors.gender = 'Gender is required';
      }
  
      // Phone number validation
      if (formData.contact?.phoneNumber && !phoneRegex.test(formData.contact.phoneNumber)) {
        newErrors.phoneNumber = 'Invalid phone number (10 digits required)';
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }


  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        setLoading(true);
        const response = await CLIENT_API.get(`/student/profile/${user?._id}`);
        console.log('Fetched student Data:', response.data.data);
        setAvatarPreview(response.data.data.profile?.avatar)
        setStudent(response.data.data);
        setFormData(response.data.data); 
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load profile data.');
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [user?._id]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      profile: {
        ...prev.profile,
        [name]: value, 
      },
      contact: {
        ...prev.contact,
        [name]: value, 
      },
    }));
  };
  
  // Handle profile update submission
  const handleUpdateProfile = async () => {
    try {
      if (!validateForm()) return;
      const response = await CLIENT_API.put(`/student/profile/${user?._id}`, formData);
      console.log('Update Response:', response.data);
      const updatedProfile = response.data.data
      setAvatarPreview(updatedProfile.profile?.avatar)
      setStudent(updatedProfile);
      setIsEditing(false); 
      setErrors({});

      // Update Redux store
      dispatch(updateUserProfile(updatedProfile));

      // Emit socket event for profile photo update
      if (socket && updatedProfile.profile?.avatar) {
        socket.emit('profilePhotoUpdated', {
          userId: user?._id,
          avatar: updatedProfile.profile?.avatar,
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile.');
    }
  };

  // Render loading or error states
  if (loading) return <div className="text-center p-6">Loading profile...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!student) return <div className="text-center p-6">No profile data available.</div>;

  

  const handleFile = async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
  
      try {
        const fileUrl = await uploadToCloudinary(file);
        if (fileUrl) {
          setAvatarPreview(fileUrl)
          setFormData((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              avatar: fileUrl, 
            },
          }));
        } else {
          console.error("Failed to upload file");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
  return (
    <div className="max-w-6xl mx-auto p-6 lg:w-5/6 bg-white rounded-lg shadow-md my-10">
      {/* Header with student basic info */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b">
        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
          {/* <img src={avatarPreview?? profilePic} alt="profile picture" className="w-full h-full object-cover rounded-full" /> */}
          {isEditing ? (
    <label className="w-full h-full rounded-full cursor-pointer">
      <img
        src={avatarPreview || profilePic}
        alt="profile picture"
        className="w-full h-full object-cover rounded-full "
      />
      <input
        type="file"
        accept="image/*"
        onChange={(event)=>handleFile(event)}
        className="hidden"
      />
    </label>
  ) : (
    <img
      src={avatarPreview || profilePic}
      alt="profile picture"
      className="w-full h-full object-cover rounded-full"
    />
  )}
        </div>

        <div className="flex-1">
        <>
              <h1 className="text-3xl font-bold">{student.userName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Mail size={16} className="text-gray-500" />
                <span className="text-gray-700">{student.email}</span>
              </div>
            </>
          <div className="flex flex-wrap gap-4 mt-4">
            
            {student.isOtpVerified && (
              <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <CheckCircle size={14} />
                Verified
              </span>
            )}
            {student.isBlocked && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <AlertTriangle size={14} />
                Account Blocked
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-3 mt-4 md:mt-0">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={18} />
            <span>Started At: {new Date(student?.createdAt ?? '').toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Award size={18} />
            {isEditing ? (
              <input
                type="text"
                name="qualification"
                value={formData.qualification || ''}
                onChange={handleInputChange}
                className="border-b-2 border-blue-600 outline-none"
              />
            ) : (
              <span>Qualification: {student.qualification}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="flex border-b mt-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'contact' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-medium mb-3">Qualification</h2>
              {isEditing ? (
                <>
                <input
                  name="qualification"
                  value={formData.qualification || ''}
                  onChange={handleInputChange}
                  className="w-full border border-blue-600 rounded p-2 outline-none"
                />
                {errors.qualification && (
                  <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>
                )}
                </>
              ) : (
                <p className="text-gray-700">{student?.qualification || 'Not specified'}</p>
              )}
            </div>
            
            <div>
              <h2 className="text-base font-medium mb-3">Date of Birth</h2>
              {isEditing ? (
                <>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.profile?.dateOfBirth || ''}
                  onChange={handleInputChange}
                  className="w-full border border-blue-600 rounded p-2 outline-none"
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                )}
                </>
              ) : (
                <p className="text-gray-700">{student?.profile?.dateOfBirth || 'Not specified'}</p>
              )}
            </div>

             {/* Gender */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Gender</h2>
              {isEditing ? (
                <>
                <select
                  name="gender"
                  value={formData.profile?.gender || ''}
                  onChange={handleInputChange}
                  className="w-full border border-blue-600 rounded p-2 outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                 {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
                </>
              ) : (
                <p className="text-gray-700">{student?.profile?.gender || 'Not specified'}</p>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Phone size={20} className="text-gray-500 mt-1" />
              <div>
                <h3 className="font-medium">Phone</h3>
                {isEditing ? (
                  <>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.contact?.phoneNumber || ''}
                    onChange={handleInputChange}
                    className="border-b-2 border-blue-600 outline-none w-full"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                  </>
                ) : (
                  <p className="text-gray-700">{student?.contact?.phoneNumber}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-gray-500 mt-1" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-700">{student?.email}</p>
              </div>
            </div>
            
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => (isEditing ? handleUpdateProfile() : setIsEditing(true))}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;

