import axios from 'axios';
import { env } from '../../common/env';

export const CLIENT_API = axios.create({
    baseURL: env.BACKEND_API_URL,
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    }
})

CLIENT_API.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  CLIENT_API.interceptors.response.use(
    (response) => {
      if(response.data.isBlocked){
        console.log('user blocked')
      }
      return response;
    },
    (error) => {
      console.error('error in response interceptor',error.message)
      return Promise.reject(error);
    }
  );