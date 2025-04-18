// import { createAsyncThunk } from '@reduxjs/toolkit';
// import { SignupFormData, Response } from '../../../../types/IForm';
// import { CLIENT_API } from "../../../../utilities/axios/Axios";
// import { AxiosError } from "axios";


// export const updateProfileAction = createAsyncThunk <Response, SignupFormData>(
//     'auth/updateProfile',
//     async ({ userId, formData }: { userId: string; formData: Partial<SignupFormData> },{rejectWithValue} ) => {
//         try {
//             const response = await CLIENT_API.put(`/student/profile/${userId}`, formData); // Adjust API endpoint

            
//             if(response.data.success){
//                 return response.data
//             }else{
//                 return rejectWithValue(response.data)
//             }
            
//         } catch (error) {
//             const e: AxiosError = error as AxiosError;
//             console.error('Error from backend:', e.response?.data || e.message);
//             return rejectWithValue(e.response?.data || e.message)
//         }
//     }
// )
