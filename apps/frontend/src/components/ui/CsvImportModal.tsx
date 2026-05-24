import Button from '@ui/Button'
import { X, Upload, CheckCircle, XCircle } from 'lucide-react'
import { useRef, useState } from 'react'

import type { ImportResult } from '@insights/contracts'

export interface CsvImportConfig {
  title: string
  onImportFile: (file: File) => Promise<ImportResult>
  onImportUrl: (url: string) => Promise<ImportResult>
  onSuccess?: () => void
}

interface Props {
  config: CsvImportConfig
  onClose: () => void
}

export default function CsvImportModal({ config, onClose }: Props) {
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function isValidUrl(s: string) {
    try { const u = new URL(s); return u.protocol === 'https:' || u.protocol === 'http:' } catch { return false }
  }

  const canSubmit = !loading && (isValidUrl(url) || file !== null)

  async function run(action: () => Promise<ImportResult>) {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await action()
      setResult(res)
      config.onSuccess?.()
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? 'Ошибка импорта')
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0]
    if (!picked) return
    setFile(picked)
    setUrl('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    if (file) {
      run(() => config.onImportFile(file)).then(() => {
        setFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      })
    } else {
      run(() => config.onImportUrl(url.trim()))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">{config.title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {/* URL input */}
          <input
            type="url"
            placeholder="Вставьте ссылку на .csv файл"
            value={url}
            onChange={e => { setUrl(e.target.value); setFile(null) }}
            disabled={loading}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50"
          />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-600">или</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* File drop area */}
          <div
            onClick={() => !loading && fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-xl p-7 flex flex-col items-center gap-2 cursor-pointer transition-colors group ${
              file
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-slate-700 hover:border-emerald-500/50'
            }`}
          >
            <Upload size={24} className={`transition-colors ${file ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400'}`} />
            {file ? (
              <p className="text-sm text-emerald-400 font-medium truncate max-w-full px-2">{file.name}</p>
            ) : (
              <p className="text-slate-400 text-sm text-center">
                Нажмите чтобы выбрать <span className="text-emerald-400">.csv</span> файл
              </p>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />

          {/* Result / Error */}
          {result && (
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle size={15} />
              {[
                result.created > 0 && `+${result.created} создано`,
                result.updated != null && result.updated > 0 && `${result.updated} обновлено`,
                result.skipped > 0 && `${result.skipped} пропущено`,
              ].filter(Boolean).join(', ') || 'Без изменений'}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400">
              <XCircle size={15} />
              {error}
            </div>
          )}

          {result ? (
            <Button type="button" onClick={onClose}>
              Готово
            </Button>
          ) : (
            <Button type="submit" isLoading={loading} disabled={!canSubmit}>
              <Upload size={15} />
              Загрузить
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
