import { ref } from 'vue'

type UploadResult = {
  url: string
  publicId: string
}

export function useCloudinary() {
  const isUploading = ref(false)
  const lastError = ref<string | null>(null)

  function getConfig() {
    const config = useRuntimeConfig().public as any
    const cloudName = config?.cloudinary?.cloudName || ''
    const uploadPreset = config?.cloudinary?.uploadPreset || ''
    return { cloudName, uploadPreset }
  }

  async function uploadImage(file: File): Promise<UploadResult> {
    const { cloudName, uploadPreset } = getConfig()
    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary config is missing: cloudName or uploadPreset')
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', uploadPreset)

    isUploading.value = true
    lastError.value = null
    try {
      const res = await fetch(endpoint, { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message || 'Upload failed')
      }
      return { url: data.secure_url as string, publicId: data.public_id as string }
    } catch (err: any) {
      lastError.value = err.message || 'Upload failed'
      throw err
    } finally {
      isUploading.value = false
    }
  }

  return { isUploading, lastError, uploadImage }
}


