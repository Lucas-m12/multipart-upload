import axios from 'axios'
import type { Uploader } from '../../types'

export interface PresignResponse {
  url: string
  // method?: string
  // headers?: Record<string, string>
  // fields?: Record<string, string>
  // publicUrl?: string
}

export interface PresignedOptions {
  getPresignedUrl(file: File, ctx: { signal: AbortSignal }): Promise<PresignResponse>
}

export function createPresignedUploader({ getPresignedUrl }: PresignedOptions): Uploader {
  return {
    async upload(file, { onProgress, signal }) {
      const { url } = await getPresignedUrl(file, { signal })

      return axios.put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progress) => {
          if (progress.total) {
            const percentage = Math.round(progress.loaded / progress.total);
            onProgress(percentage, { bytesSent: progress.loaded, bytesTotal: progress.total })
          }
        },
      });
    },
  }
}
