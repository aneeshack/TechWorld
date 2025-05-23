import { createAsyncThunk } from "@reduxjs/toolkit";
import { Response, SignupFormData } from "../../../../types/IForm";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/Axios";

export const RegisterAction = createAsyncThunk<Response, SignupFormData>(
  "auth/instructorRegister",
  async (data: SignupFormData, { rejectWithValue }) => {
    try {
        const response = await CLIENT_API.post('/register',data)
        console.log('repsonse',response.data)
        if(!response.data.success){
          console.log('error in register', response)
          return rejectWithValue(response.data)
        }
          return response.data
        
    } catch (error) {
      const e: AxiosError = error as AxiosError;
      console.error("Error from backend:", e.response?.data || e.message);
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);
