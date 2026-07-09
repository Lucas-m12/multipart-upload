import axios from "axios";

const PRESIGN_URL = import.meta.env.VITE_PRESIGN_URL;

export const getPresignedUrl = async (file: File, { signal }: { signal: AbortSignal }) => {
  if (!PRESIGN_URL) {
    throw new Error('VITE_PRESIGN_URL is not set — copy apps/web/.env.example to apps/web/.env and set it.');
  }

  const { data } = await axios.post<{ signedUrl: string }>(PRESIGN_URL, {
    filename: file.name,
  }, {
    signal,
  });
  
  return {
    url: data.signedUrl,
  }
}