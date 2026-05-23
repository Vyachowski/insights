import { useRef, useState } from 'react'
import { X, Upload, Link, CheckCircle, XCircle } from 'lucide-react'

import Button from '@ui/Button'
import Input from '@ui/Input'
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

type Tab = 'file' | 'url'

export default function CsvImportModal({ config, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('file')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    const file = e.target.files?.[0]
    if (!file) return
    run(() => config.onImportFile(file)).then(() => {
      if (fileInputRef.current) fileInputRef.current.value = ''
    })
  }

  function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    run(() => config.onImportUrl(url.trim()))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">{config.title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4">
          {(['file', 'url'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setResult(null); setError(null) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t === 'file' ? <Upload size={14} /> : <Link size={14} />}
              {t === 'file' ? 'Файл' : 'Ссылка'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {tab === 'file' ? (
            <div className="flex flex-col items-center gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors group"
              >
                <Upload size={28} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                <p className="text-slate-400 text-sm text-center">
                  Нажмите чтобы выбрать <span className="text-emerald-400">.csv</span> файл
                </p>
              </div>
              <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
            </div>
          ) : (
            <form onSubmit={handleUrlSubmit} className="flex flex-col gap-4">
              <Input
                placeholder="https://example.com/data.csv"
                value={url}
                onChange={e => setUrl(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" isLoading={loading} disabled={!url.trim()}>
                <Link size={15} />
                Загрузить
              </Button>
            </form>
          )}

          {/* Result / Error */}
          {result && (
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle size={15} />
              +{result.created} загружено{result.skipped > 0 ? `, ${result.skipped} пропущено` : ''}
            </div>
          )}
          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-red-400">
              <XCircle size={15} />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
