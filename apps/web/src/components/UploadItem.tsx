import type { Upload } from '../types'
import { UploadStatus } from '../types'
import { describeKind, formatBytes, formatPercent, formatSpeed } from '../lib/format'
import { AlertIcon, CheckIcon, CloseIcon, RetryIcon, TrashIcon } from './icons'

interface UploadItemProps {
  upload: Upload
  onCancel: (id: string) => void
  onRetry: (id: string) => void
  onRemove: (id: string) => void
}

const STATUS_LABEL: Record<UploadStatus, string> = {
  [UploadStatus.Queued]: 'Queued',
  [UploadStatus.Uploading]: 'Uploading',
  [UploadStatus.Success]: 'Uploaded',
  [UploadStatus.Error]: 'Failed',
  [UploadStatus.Canceled]: 'Canceled',
}

export function UploadItem({ upload, onCancel, onRetry, onRemove }: UploadItemProps) {
  const { id, name, size, type, status, progress, speed } = upload
  const { label, tone } = describeKind(name, type)
  const width = status === UploadStatus.Success ? '100%' : `${Math.round(progress * 100)}%`

  return (
    <li className="item" data-status={status}>
      <span className="item__glyph" data-tone={tone}>
        {label}
      </span>

      <div className="item__body">
        <div className="item__row">
          <span className="item__name" title={name}>
            {name}
          </span>
          {status === UploadStatus.Success ? (
            <span className="item__mark item__mark--done">
              <CheckIcon width={15} height={15} />
            </span>
          ) : status === UploadStatus.Error ? (
            <span className="item__mark item__mark--error">
              <AlertIcon width={15} height={15} />
            </span>
          ) : (
            <span className="item__pct">{formatPercent(progress)}</span>
          )}
        </div>

        <div className="track">
          <div className="fill" style={{ width }} />
        </div>

        <div className="item__meta">
          <span>{formatBytes(size)}</span>
          <span className="item__status">
            {status === UploadStatus.Error && upload.error ? upload.error : STATUS_LABEL[status]}
          </span>
          {status === UploadStatus.Uploading && speed > 0 && <span>{formatSpeed(speed)}</span>}
        </div>
      </div>

      <div className="item__actions">
        {(status === UploadStatus.Uploading || status === UploadStatus.Queued) && (
          <button className="iconbtn" onClick={() => onCancel(id)} aria-label="Cancel upload">
            <CloseIcon width={17} height={17} />
          </button>
        )}
        {(status === UploadStatus.Error || status === UploadStatus.Canceled) && (
          <button className="iconbtn iconbtn--accent" onClick={() => onRetry(id)} aria-label="Retry upload">
            <RetryIcon width={17} height={17} />
          </button>
        )}
        {status !== UploadStatus.Uploading && status !== UploadStatus.Queued && (
          <button className="iconbtn" onClick={() => onRemove(id)} aria-label="Remove">
            <TrashIcon width={17} height={17} />
          </button>
        )}
      </div>
    </li>
  )
}
