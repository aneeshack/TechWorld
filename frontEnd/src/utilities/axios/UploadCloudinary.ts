import axios from "axios";
import { env } from "../../common/env";

const presetName = env.CLOUD_PRESET ;
const cloudName = env.CLOUD_NAME;


export const uploadToCloudinary = async(file: File|string|undefined):Promise<string> =>{
    console.log('name',presetName,cloudName)
    if(file === undefined) return ""

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset',presetName);

    let resourceType = "image";

    if (file instanceof File && file.type === "application/pdf") {
        resourceType = "raw";
    }
    
    try {
        const {data} = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, 
        formData, 
        {withCredentials: false})
        console.log('image or data from cloudinary:',data,data.secure_url)
        return data.secure_url;

    } catch (error) {
        console.error('error in cloudinary',error)
        return ""
    }
}


export const chatUploadToCloud = async (file: File | string | undefined): Promise<string> => {
    if (!file || typeof file === "string") return "";
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", presetName);
  
    const uploadEndpoint = getUploadEndpoint(file.type);
  
    try {
      const { data } = await axios.post(uploadEndpoint, formData, { withCredentials: false });
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return "";
    }
  };
  
  // Helper
  const getUploadEndpoint = (fileType: string): string => {
    if (fileType.startsWith("image/")) {
      return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    }
    if (fileType.startsWith("video/")) {
      return `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
    }
    if (fileType.startsWith("audio/")) {
      return `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`; // Cloudinary uses "video" endpoint for audio too
    }
    if (
      fileType === "application/pdf" ||
      fileType === "application/msword" ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`; // for pdf, doc, docx
    }
  
    // Default to raw upload for any unknown type
    return `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
  };
  