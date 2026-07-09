import type { Uploader } from '../../types'

function abortError(): DOMException {
  return new DOMException('Upload canceled', 'AbortError')
}

interface MockOptions {
  minDuration?: number
  maxDuration?: number
  throughput?: number
}

export function createMockUploader({
  minDuration = 900,
  maxDuration = 5000,
  throughput = 2.5 * 1024 * 1024,
}: MockOptions = {}): Uploader {
  return {
    upload(file, { onProgress, signal }) {
      return new Promise((resolve, reject) => {
        if (signal.aborted) {
          reject(abortError())
          return
        }

        const total = file.size || 1
        const duration = Math.min(Math.max((total / throughput) * 1000, minDuration), maxDuration)
        const start = performance.now()
        let frame = 0

        const cleanup = () => {
          cancelAnimationFrame(frame)
          signal.removeEventListener('abort', onAbort)
        }

        const onAbort = () => {
          cleanup()
          reject(abortError())
        }

        const tick = (now: number) => {
          const linear = Math.min((now - start) / duration, 1)
          const eased = 1 - (1 - linear) ** 1.7
          onProgress(eased, { bytesSent: Math.round(eased * total), bytesTotal: total })

          if (linear >= 1) {
            cleanup()
            resolve({ url: `https://storage.example.com/${encodeURIComponent(file.name)}` })
          } else {
            frame = requestAnimationFrame(tick)
          }
        }

        signal.addEventListener('abort', onAbort)
        frame = requestAnimationFrame(tick)
      })
    },
  }
}
