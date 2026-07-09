import { Dropzone } from './components/Dropzone'
import { UploadList } from './components/UploadList'
import { useUploads } from './hooks/useUploads'

export default function App() {
  const { uploads, add, cancel, retry, remove, clearFinished } = useUploads()

  return (
    <main className="app">
      <div className="app__aura" aria-hidden="true" />

      <div className="console">
        <header className="masthead">
          <span className="masthead__eyebrow">
            <span className="masthead__dot" />
            Transfer Console
          </span>
          <h1 className="masthead__title">Send your files</h1>
          <p className="masthead__sub">
            Drop anything below and watch it go up — direct to storage, one file at a time.
          </p>
        </header>

        <Dropzone onFiles={add} />

        <UploadList
          uploads={uploads}
          onCancel={cancel}
          onRetry={retry}
          onRemove={remove}
          onClear={clearFinished}
        />
      </div>
    </main>
  )
}
