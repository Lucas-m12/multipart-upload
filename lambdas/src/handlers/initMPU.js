import { CreateMultipartUploadCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';

export const s3 = new S3Client();

export const handler = async (event) => {
  const { filename } = JSON.parse(event.body);
  const filekey = `${randomUUID()}-${filename}`;

  const createMPUCommand = new CreateMultipartUploadCommand({
    Bucket: 'upload-study',
    Key: filekey,
  });

  const { UploadId } = await s3.send(createMPUCommand);

  if (!UploadId) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Failed generating multipart upload' }) 
    };
  }

  
  
}
