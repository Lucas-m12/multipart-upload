import { CompleteMultipartUploadCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client();

export const handler = async (event) => {
  const bucket = 'upload-study';
  const { filekey, uploadId, parts } = JSON.parse(event.body);
  const command = new CompleteMultipartUploadCommand({
    Bucket: bucket,
    Key: filekey,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts.map(part => ({
        PartNumber: part.partNumber,
        ETag: part.eTag,
      })),
    },
  });

  await s3Client.send(command);
};
