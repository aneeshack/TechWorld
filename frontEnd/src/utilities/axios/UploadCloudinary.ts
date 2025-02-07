import axios from "axios";
import { env } from "../../common/env";

const presetName = env.CLOUD_PRESET ;
const cloudName = env.CLOUD_NAME;


export const uploadToCloudinary = async(file: File|string|undefined):Promise<string> =>{
    console.log('nam',presetName,cloudName)
    if(file === undefined) return ""
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset',presetName);
    try {
        const {data} = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, 
        formData, 
        {withCredentials: false})
        console.log('image or data from cloudinary:',data,data.secure_rul)
        return data.secure_url;

    } catch (error) {
        console.error('error in cloudinary',error)
        return ""
    }
}
