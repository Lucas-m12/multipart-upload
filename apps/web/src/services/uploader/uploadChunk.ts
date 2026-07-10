import axios from "axios";

export const uploadChunk = async ({
  bytesSentByPart,
  fileChunk,
  reportProgress,
  signal,
  url,
  index
}: UploadChunkInput): Promise<UploadChunkOutput> => {
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
};

interface UploadChunkInput {
  url: string;
  fileChunk: Blob;
  signal: AbortSignal;
  bytesSentByPart: any[];
  reportProgress(): void;
  index: number;
}

interface UploadChunkOutput {
  eTag: string;
}