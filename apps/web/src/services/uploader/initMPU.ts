import axios from "axios";

const INIT_MPU_URL = import.meta.env.VITE_INIT_MPU_URL;

export const initMPU = async (
  { filename, signal, totalChunks }: InitMPUInput
): Promise<InitMPUOutput> => {
  if (!INIT_MPU_URL) {
    throw new Error('VITE_INIT_MPU_URL is not set — copy apps/web/.env.example to apps/web/.env and set it.');
  }

  const { data } = await axios.post<InitMPUOutput>(INIT_MPU_URL, {
    filename,
    totalChunks
  }, {
    signal,
  });
  
  return data;
}

interface InitMPUInput {
  filename: string;
  totalChunks: number;
  signal: AbortSignal;
}

interface InitMPUOutput {
  filekey: string;
  uploadId: string;
  parts: {
    url: string;
    partNumber: number;
  }[]
}