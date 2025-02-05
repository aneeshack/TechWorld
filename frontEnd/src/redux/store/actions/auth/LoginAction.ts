import { createAsyncThunk } from "@reduxjs/toolkit";
import { Response, SignupFormData } from "../../../../types/IForm";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/Axios";

export const loginAction = createAsyncThunk<Response, SignupFormData>(
  "auth/login",
  async (data: SignupFormData, { rejectWithValue }) => {
    try {
        const response = await CLIENT_API.post('/login',data)

        if(response.data.success){
            return response.data
        }else{
            return rejectWithValue(response.data)
        }
    } catch (error) {
      const e: AxiosError = error as AxiosError;
      console.error("Error from backend:", e.response?.data || e.message);
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);
