const UNITS = ['B', 'KB', 'MB', 'GB', 'TB']

export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B'
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), UNITS.length - 1)
  const value = bytes / 1024 ** exponent
  const rounded = value >= 100 || exponent === 0 ? Math.round(value) : value.toFixed(1)
  return `${rounded} ${UNITS[exponent]}`
}

export function formatSpeed(bytesPerSecond: number): string {
  if (!bytesPerSecond || bytesPerSecond < 1) return ''
  return `${formatBytes(bytesPerSecond)}/s`
}

export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`
}

export type FileTone = 'image' | 'video' | 'audio' | 'doc' | 'other'

export function describeKind(name: string, mime: string): { label: string; tone: FileTone } {
  const ext = (name.split('.').pop() ?? '').toUpperCase().slice(0, 4)
  const label = ext && ext !== name.toUpperCase() ? ext : 'FILE'
  if (mime.startsWith('image/')) return { label, tone: 'image' }
  if (mime.startsWith('video/')) return { label, tone: 'video' }
  if (mime.startsWith('audio/')) return { label, tone: 'audio' }
  if (/pdf|word|text|sheet|csv|json|zip|rar|tar/.test(mime) || /ZIP|RAR|CSV|PDF|TXT|DOC/.test(label))
    return { label, tone: 'doc' }
  return { label, tone: 'other' }
}
