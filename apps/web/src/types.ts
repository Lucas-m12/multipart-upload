export const UploadStatus = {
  Queued: 'queued',
  Uploading: 'uploading',
  Success: 'success',
  Error: 'error',
  Canceled: 'canceled',
} as const

export type UploadStatus = (typeof UploadStatus)[keyof typeof UploadStatus]

export interface Upload {
  id: string
  file: File
  name: string
  size: number
  type: string
  status: UploadStatus
  progress: number
  bytesSent: number
  speed: number
  error: string | null
  url: string | null
}

export interface ProgressInfo {
  bytesSent: number
  bytesTotal: number
}

export type OnProgress = (fraction: number, info?: ProgressInfo) => void

export interface UploadContext {
  onProgress: OnProgress
  signal: AbortSignal
}

export interface UploadResult {
  url?: string
}

export interface Uploader {
  upload(file: File, ctx: UploadContext): Promise<UploadResult>
}

let sequence = 0

export function createUpload(file: File): Upload {
  sequence += 1
  return {
    id: `${Date.now().toString(36)}-${sequence}`,
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    status: UploadStatus.Queued,
    progress: 0,
    bytesSent: 0,
    speed: 0,
    error: null,
    url: null,
  }
}
