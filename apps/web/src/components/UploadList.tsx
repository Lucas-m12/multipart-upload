import type { Upload } from '../types'
import { UploadStatus } from '../types'
import { UploadItem } from './UploadItem'

interface UploadListProps {
  uploads: Upload[]
  onCancel: (id: string) => void
  onRetry: (id: string) => void
  onRemove: (id: string) => void
  onClear: () => void
}

export function UploadList({ uploads, onCancel, onRetry, onRemove, onClear }: UploadListProps) {
  if (uploads.length === 0) return null

  const active = uploads.filter(
    (item) => item.status === UploadStatus.Uploading || item.status === UploadStatus.Queued,
  ).length

  return (
    <section className="list">
      <header className="list__head">
        <span className="list__count">
          {uploads.length} {uploads.length === 1 ? 'file' : 'files'}
        </span>
        {active > 0 ? (
          <span className="list__active">{active} uploading</span>
        ) : (
          <button className="list__clear" onClick={onClear}>
            Clear all
          </button>
        )}
      </header>

      <ul className="list__items">
        {uploads.map((upload) => (
          <UploadItem
            key={upload.id}
            upload={upload}
            onCancel={onCancel}
            onRetry={onRetry}
            onRemove={onRemove}
          />
        ))}
      </ul>
    </section>
  )
}
