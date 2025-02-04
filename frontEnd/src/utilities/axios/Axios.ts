import axios from 'axios';
import { env } from '../../common/env';

export const CLIENT_API = axios.create({
    baseURL: env.BACKEND_API_URL,
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    }
})

