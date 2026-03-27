import { createClient } from '@/lib/supabase/server'

export async function uploadFile(bucket: 'course-videos' | 'thumbnails' | 'documents' | 'banners', path: string, file: File) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return publicUrl
}

export async function deleteFile(bucket: string, path: string) {
  const supabase = await createClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}
