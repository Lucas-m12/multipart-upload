import axios from "axios";

const COMPLETE_MPU_URL = import.meta.env.VITE_COMPLETE_MPU_URL;

export const completeMPU = async (
  { filekey, parts, uploadId, signal }: CompleteMPUInput
): Promise<CompleteMPUOutput> => {
  if (!COMPLETE_MPU_URL) {
    throw new Error('VITE_COMPLETE_MPU_URL is not set — copy apps/web/.env.example to apps/web/.env and set it.');
  }

  const { data } = await axios.post<CompleteMPUOutput>(COMPLETE_MPU_URL, {
    filekey,
    parts,
    uploadId,
  }, {
    signal,
  });
  
  return data;
}

interface CompleteMPUInput {
  filekey: string;
  uploadId: string;
  parts: {
    partNumber: number;
    eTag: string;
  }[];
  signal: AbortSignal
}

interface CompleteMPUOutput {
  filekey: string;
  uploadId: string;
  parts: {
    url: string;
    partNumber: number;
  }[]
}