import { useId, useState } from 'react'
import axios from 'axios'
import { uploadVehicleDocument } from '@/api/file.ts'
import { t } from '@/shared/i18n'
import { useAuthStore } from '@/store/authStore.ts'

export default function VehicleOwnershipUploadComponent() {
  const inputId = useId()
  const authenticated = useAuthStore((state) => state.authenticated)

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!authenticated) {
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null
    setFile(selectedFile)
    setError(null)
    setResult(null)
  }

  const handleUpload = async () => {
    if (!file) {
      setError(t('file.ownershipUpload.errors.noFile'))
      return
    }

    try {
      setLoading(true)
      setError(null)
      setResult(null)

      const res = await uploadVehicleDocument(file)
      setResult(res.path)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? t('file.ownershipUpload.errors.failed'))
      } else {
        setError(t('file.ownershipUpload.errors.failed'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        {t('file.ownershipUpload.title')}
      </h2>

      <div className="mb-4">
        <input
          id={inputId}
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label
            htmlFor={inputId}
            className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            {t('file.ownershipUpload.browse')}
          </label>

          <div className="min-h-[24px] text-sm text-slate-600">
            {file ? file.name : t('file.ownershipUpload.noFileChosen')}
          </div>
        </div>
      </div>

      {file && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">
            {t('file.ownershipUpload.selectedFile')}
          </p>
          <p className="mt-1 break-all text-sm text-slate-600">{file.name}</p>
          <p className="mt-1 text-xs text-slate-500">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={loading || !file}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? t('file.ownershipUpload.uploading') : t('file.ownershipUpload.submit')}
      </button>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <p className="font-medium">{t('file.ownershipUpload.success')}</p>
          <p className="mt-1 break-all">{result}</p>
        </div>
      )}
    </section>
  )
}
