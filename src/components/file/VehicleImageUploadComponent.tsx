import { useId, useState } from 'react'
import axios from 'axios'
import { t } from '@/shared/i18n'
import { useAuthStore } from '@/store/authStore.ts'
import { uploadVehicleImage } from "@/api/file.ts";

export default function VehicleImageUploadComponent() {
  const inputId = useId()
  const authenticated = useAuthStore((state) => state.authenticated)

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const previewUrl = file ? URL.createObjectURL(file) : null

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
      setError(t('file.upload.errors.noFile'))
      return
    }

    try {
      setLoading(true)
      setError(null)
      setResult(null)

      const res = await uploadVehicleImage(file)
      setResult(res.path)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? t('file.upload.errors.failed'))
      } else {
        setError(t('file.upload.errors.failed'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        {t('file.upload.title')}
      </h2>

      <div className="mb-4">
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label
            htmlFor={inputId}
            className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            {t('file.upload.browse')}
          </label>

          <div className="min-h-[24px] text-sm text-slate-600">
            {file ? file.name : t('file.upload.noFileChosen')}
          </div>
        </div>
      </div>

      {previewUrl && (
        <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="border-b border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            {t('file.upload.preview')}
          </div>
          <div className="p-4">
            <img
              src={previewUrl}
              alt={t('file.upload.previewAlt')}
              className="max-h-72 w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={loading || !file}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? t('file.upload.uploading') : t('file.upload.submit')}
      </button>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <p className="font-medium">{t('file.upload.success')}</p>
          <p className="mt-1 break-all">{result}</p>
        </div>
      )}
    </section>
  )
}
