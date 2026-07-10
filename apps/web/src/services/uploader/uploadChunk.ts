import axios from "axios";
import { sleep } from "../../lib/sleep";

export const uploadChunk = async ({
  bytesSentByPart,
  fileChunk,
  reportProgress,
  signal,
  url,
  index,
  maxRetries = 3,
}: UploadChunkInput): Promise<UploadChunkOutput> => {
  try {
    const { headers } = await axios.put(url, fileChunk, {
      signal,
      onUploadProgress: (event) => {
        bytesSentByPart[index] = event.loaded;
        reportProgress();
      },
    });
    bytesSentByPart[index] = fileChunk.size;
    reportProgress();
    const eTag = headers['etag']?.replace(/"/g, '');
    return { eTag };
  } catch (error) {
    if (maxRetries <= 0 ) throw error;
    
    await sleep(2);
    return uploadChunk({
      bytesSentByPart,
      fileChunk,
      index,
      reportProgress,
      signal,
      url,
      maxRetries: maxRetries - 1,
    });
  }
};

interface UploadChunkInput {
  url: string;
  fileChunk: Blob;
  signal: AbortSignal;
  bytesSentByPart: any[];
  reportProgress(): void;
  index: number;
  maxRetries?: number;
}

interface UploadChunkOutput {
  eTag: string;
}