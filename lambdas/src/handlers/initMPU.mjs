import { CreateMultipartUploadCommand, S3Client, UploadPartCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from 'node:crypto';

export const s3 = new S3Client();

export const handler = async (event) => {
  const bucket = 'upload-study';
  const { filename, totalChunks } = JSON.parse(event.body);
  const filekey = `${randomUUID()}-${filename}`;

  const createMPUCommand = new CreateMultipartUploadCommand({
    Bucket: bucket,
    Key: filekey,
  });

  const { UploadId } = await s3.send(createMPUCommand);

  if (!UploadId) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Failed generating multipart upload' }) 
    };
  }

  const signedUrlPromises = [];

  for (let partNumber = 1; partNumber <= totalChunks; partNumber++) {
    const uploadPartCommand = new UploadPartCommand({
      Bucket: bucket,
      Key: filekey,
      UploadId,
      PartNumber: 1,
    });

    const uploadPart = getSignedUrl(
      s3, uploadPartCommand, { expiresIn: 3600 }
    );

    signedUrlPromises.push(uploadPart);
  }

  const urls = await Promise.all(signedUrlPromises);

  return {
    statusCode: 200,
    body: JSON.stringify({
      filekey,
      uploadId: UploadId,
      parts: urls.map((url, index) => ({ url, partNumber: index + 1 })),
    }),
  };
}
