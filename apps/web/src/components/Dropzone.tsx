import { useDropzone } from 'react-dropzone'
import { UploadIcon } from './icons'

interface DropzoneProps {
  onFiles: (files: File[]) => void
}

export function Dropzone({ onFiles }: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted) => {
      if (accepted.length > 0) onFiles(accepted)
    },
  })

  return (
    <div {...getRootProps({ className: `dropzone${isDragActive ? ' dropzone--active' : ''} cursor-pointer` })}>
      <input {...getInputProps()} />
      <span className="dropzone__bay">
        <UploadIcon className="dropzone__icon" />
      </span>
      <p className="dropzone__title">{isDragActive ? 'Release to send' : 'Drop files to upload'}</p>
      <p className="dropzone__hint">
        or <span className="dropzone__browse">browse</span> from your device
      </p>
    </div>
  )
}
