import { mb2bytes } from '../../lib/mb2bytes';
import type { UploadContext } from '../../types';
import { completeMPU } from './completeMPU';
import { initMPU } from './initMPU';
import { uploadChunk } from './uploadChunk';

export const createPresignedUploader = () => {
  return {
    async upload(file: File, { onProgress, signal }: UploadContext) {
      if (!file) return { url: undefined };

      const chunkSize = mb2bytes(5);
      const totalChunks = Math.ceil(file.size / chunkSize);

      const { filekey, parts, uploadId } = await initMPU(
        { filename: file.name, totalChunks, signal }
      );

      const bytesTotal = file.size;
      const bytesSentByPart = new Array(parts.length).fill(0);

      const reportProgress = () => {
        const bytesSent = bytesSentByPart.reduce((sum, loaded) => sum + loaded, 0);
        onProgress(bytesTotal > 0 ? bytesSent / bytesTotal : 0, { bytesSent, bytesTotal });
      };

      const uploadedParts = await Promise.all(
        parts.map(async ({ url, partNumber }, index) => {
          const chunkStart = index * chunkSize;
          const chunkEnd = Math.min(chunkStart + chunkSize, file.size);

          const fileChunk = file.slice(chunkStart, chunkEnd);

          const { eTag } = await uploadChunk({
            bytesSentByPart,
            fileChunk,
            index,
            reportProgress,
            signal,
            url,
          });

          return {
            partNumber,
            eTag,
          }
        })
      );

      await completeMPU({ filekey, parts: uploadedParts, signal, uploadId });

      const objectUrl = parts[0] && new URL(parts[0].url);
      return { url: objectUrl ? `${objectUrl.origin}${objectUrl.pathname}` : undefined };
    },
  }
}
