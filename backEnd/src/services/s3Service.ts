import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


class S3Service {
  private _s3Client: S3Client;

  constructor() {
    this._s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
      },
    });
  }

  async generatePresignedUrl(key: string, expiresIn: number = 300): Promise<string> {
    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Expires: expiresIn, 
      };

      const command = new GetObjectCommand(params);
      const presignedUrl = await getSignedUrl(this._s3Client, command, { expiresIn });
      return presignedUrl;
    } catch (error) {
      console.error("S3Service error: generating presigned URL", error);
      throw new Error(`Failed to generate presigned URL: ${(error as Error).message}`);
    }
  }

  // New method for uploading (PutObjectCommand)
  async generatePresignedUrlForUpload(
    key: string,
    fileType: string,
    expiresIn: number = 6000
  ): Promise<{ presignedUrl: string; videoUrl: string }> {
    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
      };

      const command = new PutObjectCommand(params);
      const presignedUrl = await getSignedUrl(this._s3Client, command, { expiresIn });

      const videoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      console.log('presigned url',presignedUrl,'videourl',videoUrl)
      return { presignedUrl, videoUrl };
    } catch (error) {
      console.error("S3Service error: generating presigned URL for upload", error);
      throw new Error(`Failed to generate presigned URL for upload: ${(error as Error).message}`);
    }
  }


}

export default S3Service;