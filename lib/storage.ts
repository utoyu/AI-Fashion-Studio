import { supabase } from './supabase';

/**
 * Storage Adapter for Image Uploads
 * Currently uses Supabase Storage as the primary storage provider.
 * Follows an Adapter Pattern to allow future integration with Aliyun OSS, MinIO, etc.
 */

const BUCKET_NAME = 'ai-fashion-images';

/**
 * Upload an image file to cloud storage (Supabase)
 * @param file The file object to upload
 * @returns Promise with the public URL of the uploaded image
 */
export async function uploadImage(file: File): Promise<string> {
    // FUTURE: Logic for choosing between different storage providers
    // if (process.env.STORAGE_PROVIDER === 'ALIYUN') return uploadToAliyun(file);

    // Helper to get extension from mime type
    const getExtFromType = (type: string) => {
        const parts = type.split('/');
        return parts.length > 1 ? parts[1] : 'png';
    };

    // Robust extension extraction
    let fileExt = file.name.includes('.') ? file.name.split('.').pop() : getExtFromType(file.type);

    // Clean extension (remove any non-alphanumeric characters)
    fileExt = fileExt?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'png';
    if (fileExt === 'jpeg') fileExt = 'jpg';

    const uniqueId = Math.random().toString(36).substring(2, 9);
    const fileName = `${Date.now()}-${uniqueId}.${fileExt}`;
    const filePath = fileName;

    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase Upload Error:', error);
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Storage Adapter Error:', error);
        throw new Error('Failed to upload image to storage');
    }
}

/**
 * Placeholder for Aliyun OSS implementation
 */
async function uploadToAliyun(file: File): Promise<string> {
    console.log('Aliyun upload requested for:', file.name);
    throw new Error('Aliyun storage not implemented yet');
}
