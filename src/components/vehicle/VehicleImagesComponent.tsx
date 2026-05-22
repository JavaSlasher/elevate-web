import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
    deleteVehicleImage,
    getVehicleImageNames,
    getVehicleImageUrl,
    replaceVehicleImage,
    uploadVehicleImages,
} from '@/api/file'
import { t } from '@/shared/i18n'
import { getErrorMessage } from '@/shared/utils/errorMessageUtil.ts'
import { useAuthStore } from '@/store/authStore.ts'
import type { VehicleImagesComponentProps } from '@/types/vehicle.ts'

export default function VehicleImagesComponent({
                                                   vehicleId,
                                                   canManage = false,
                                               }: VehicleImagesComponentProps) {
    const authenticated = useAuthStore((state) => state.authenticated)
    const queryClient = useQueryClient()

    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [error, setError] = useState<string | null>(null)

    const previewUrls = useMemo(
        () =>
            selectedFiles.map((file) => ({
                file,
                url: URL.createObjectURL(file),
            })),
        [selectedFiles],
    )

    const {
        data: imageNames = [],
        isPending,
        isError,
        error: imagesError,
    } = useQuery<string[]>({
        queryKey: ['vehicle', vehicleId, 'images'],
        queryFn: () => getVehicleImageNames(vehicleId),
        enabled: Boolean(vehicleId),
    })

    const uploadMutation = useMutation({
        mutationFn: () => uploadVehicleImages(vehicleId, selectedFiles),
        onSuccess: async () => {
            setSelectedFiles([])
            setError(null)

            await queryClient.invalidateQueries({
                queryKey: ['vehicle', vehicleId, 'images'],
            })
        },
        onError: (err: unknown) => {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? t('file.upload.errors.failed'))
                return
            }

            setError(t('file.upload.errors.failed'))
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (imageName: string) => deleteVehicleImage(vehicleId, imageName),
        onSuccess: async () => {
            setError(null)

            await queryClient.invalidateQueries({
                queryKey: ['vehicle', vehicleId, 'images'],
            })
        },
        onError: (err: unknown) => {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ??
                    t('vehicle.images.deleteFailed') ??
                    'Failed to delete image',
                )
                return
            }

            setError(t('vehicle.images.deleteFailed') ?? 'Failed to delete image')
        },
    })

    const replaceMutation = useMutation({
        mutationFn: ({ imageName, file }: { imageName: string; file: File }) =>
            replaceVehicleImage(vehicleId, imageName, file),
        onSuccess: async () => {
            setError(null)

            await queryClient.invalidateQueries({
                queryKey: ['vehicle', vehicleId, 'images'],
            })
        },
        onError: (err: unknown) => {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ??
                    t('vehicle.images.updateFailed') ??
                    'Failed to update image',
                )
                return
            }

            setError(t('vehicle.images.updateFailed') ?? 'Failed to update image')
        },
    })

    function addFiles(files: File[]) {
        setSelectedFiles((previousFiles) => [...previousFiles, ...files])
        setError(null)
    }

    function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
        addFiles(Array.from(event.target.files ?? []))
        event.target.value = ''
    }

    function handleUpload() {
        if (selectedFiles.length === 0) {
            setError(t('file.upload.errors.noFile'))
            return
        }

        uploadMutation.mutate()
    }

    function removeSelectedFile(index: number) {
        setSelectedFiles((files) => files.filter((_, fileIndex) => fileIndex !== index))
        setError(null)
    }

    function handleReplaceImage(
        imageName: string,
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0]

        if (!file) return

        replaceMutation.mutate({ imageName, file })
        event.target.value = ''
    }

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {t('vehicle.images.title')}
                    </h2>
                    <p className="text-slate-600">{t('vehicle.images.subtitle')}</p>
                </div>
            </div>

            {canManage && authenticated && (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                    <input
                        id="vehicleImagesInput"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFilesChange}
                        className="hidden"
                    />

                    <input
                        id="vehicleCameraInput"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFilesChange}
                        className="hidden"
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label
                            htmlFor="vehicleImagesInput"
                            className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                        >
                            {t('vehicle.images.browse') ?? 'Choose Photos'}
                        </label>

                        <label
                            htmlFor="vehicleCameraInput"
                            className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                            Take Photo
                        </label>

                        <span className="text-sm text-slate-600 sm:ml-1">
                            {selectedFiles.length > 0
                                ? t('vehicle.images.selectedCount').replace(
                                    '{count}',
                                    String(selectedFiles.length),
                                )
                                : t('vehicle.images.noFileChosen')}
                        </span>
                    </div>

                    {previewUrls.length > 0 && (
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {previewUrls.map(({ file, url }, index) => (
                                <div
                                    key={`${file.name}-${file.size}-${index}`}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                                >
                                    <img
                                        src={url}
                                        alt={file.name}
                                        className="h-48 w-full object-cover"
                                    />

                                    <div className="space-y-3 p-3">
                                        <p className="break-all text-sm font-medium text-slate-800">
                                            {file.name}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => removeSelectedFile(index)}
                                            className="w-full rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                                        >
                                            {t('common.remove') ?? 'Remove'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploadMutation.isPending || selectedFiles.length === 0}
                        className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {uploadMutation.isPending
                            ? t('vehicle.images.uploading')
                            : t('vehicle.images.upload')}
                    </button>
                </div>
            )}

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-6">
                {isPending ? (
                    <p className="text-slate-600">{t('common.loading')}</p>
                ) : isError ? (
                    <p className="text-sm text-red-600">{getErrorMessage(imagesError)}</p>
                ) : imageNames.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                        {t('vehicle.images.empty')}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {imageNames.map((imageName) => (
                            <div
                                key={imageName}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                            >
                                <img
                                    src={getVehicleImageUrl(vehicleId, imageName)}
                                    alt={imageName}
                                    className="h-56 w-full object-cover"
                                />

                                {canManage && authenticated && (
                                    <div className="space-y-3 p-3">
                                        <p className="break-all text-sm font-medium text-slate-700">
                                            {imageName}
                                        </p>

                                        <input
                                            id={`replace-${imageName}`}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(event) =>
                                                handleReplaceImage(imageName, event)
                                            }
                                        />

                                        <label
                                            htmlFor={`replace-${imageName}`}
                                            className="block cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-indigo-700"
                                        >
                                            {replaceMutation.isPending
                                                ? t('common.saving') ?? 'Saving...'
                                                : t('common.edit') ?? 'Edit / Replace'}
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => deleteMutation.mutate(imageName)}
                                            disabled={deleteMutation.isPending}
                                            className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                                        >
                                            {deleteMutation.isPending
                                                ? t('common.deleting') ?? 'Deleting...'
                                                : t('common.delete') ?? 'Delete'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
