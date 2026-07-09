import { useCallback, useEffect, useRef, useState } from 'react'
import { uploader } from '../services/uploader'
import type { Upload } from '../types'
import { createUpload, UploadStatus } from '../types'

interface Transfer {
  controller: AbortController
  lastTime: number
  lastBytes: number
}

export function useUploads() {
  const [uploads, setUploads] = useState<Upload[]>([])
  const transfers = useRef(new Map<string, Transfer>())
  const uploadsRef = useRef<Upload[]>([])

  useEffect(() => {
    uploadsRef.current = uploads
  }, [uploads])

  const patch = useCallback((id: string, changes: Partial<Upload>) => {
    setUploads((list) => list.map((item) => (item.id === id ? { ...item, ...changes } : item)))
  }, [])

  const start = useCallback(
    async (upload: Upload) => {
      const transfer: Transfer = { controller: new AbortController(), lastTime: performance.now(), lastBytes: 0 }
      transfers.current.set(upload.id, transfer)
      patch(upload.id, { status: UploadStatus.Uploading, progress: 0, bytesSent: 0, error: null, url: null })

      try {
        const result = await uploader
        .upload(upload.file, {
          signal: transfer.controller.signal,
          onProgress: (fraction, info) => {
            const now = performance.now()
            const bytesSent = info?.bytesSent ?? Math.round(fraction * upload.size)
            const elapsed = (now - transfer.lastTime) / 1000
            const changes: Partial<Upload> = { progress: fraction, bytesSent }
            if (elapsed > 0.2) {
              changes.speed = (bytesSent - transfer.lastBytes) / elapsed
              transfer.lastTime = now
              transfer.lastBytes = bytesSent
            }
            patch(upload.id, changes)
          },
        });

        patch(upload.id, {
          status: UploadStatus.Success,
          progress: 1,
          bytesSent: upload.size,
          speed: 0,
          url: result.url ?? null,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          patch(upload.id, { status: UploadStatus.Canceled, speed: 0 });
        } else {
          patch(upload.id, {
            status: UploadStatus.Error,
            speed: 0,
            error: error instanceof Error ? error.message : 'Upload failed',
          });
        }
      } finally {
        transfers.current.delete(upload.id);
      }
    },
    [patch],
  )

  const add = useCallback(
    (files: File[]) => {
      const created = files.map(createUpload)
      setUploads((list) => [...list, ...created])
      created.forEach(start)
    },
    [start],
  )

  const cancel = useCallback((id: string) => {
    transfers.current.get(id)?.controller.abort()
  }, [])

  const retry = useCallback(
    (id: string) => {
      const existing = uploadsRef.current.find((item) => item.id === id)
      if (existing) start(existing)
    },
    [start],
  )

  const remove = useCallback((id: string) => {
    transfers.current.get(id)?.controller.abort()
    setUploads((prevList) => {
      const newList = [...prevList];
      newList.splice(newList.findIndex((item) => item.id === id), 1);
      return newList;
    })
  }, [])

  const clearFinished = useCallback(() => {
    setUploads((list) =>
      list.filter((item) => item.status === UploadStatus.Uploading || item.status === UploadStatus.Queued),
    )
  }, [])

  return { uploads, add, cancel, retry, remove, clearFinished }
}
