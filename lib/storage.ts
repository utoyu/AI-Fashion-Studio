import path from 'path';
import { supabase } from './supabase';

/**
 * Storage Adapter for Image Uploads
 * Currently uses Supabase Storage as the primary storage provider.
 * Optimized for Mac/POSIX environments to ensure consistent cloud paths.
 */

const BUCKET_NAME = 'ai-fashion-images';

/**
 * Sanitize filename for Mac/Linux and Supabase
 * 1. Filter out .DS_Store
 * 2. Remove special characters and replace backslashes
 */
function sanitizeFileName(fileName: string): string {
    // Mac specific: ignore .DS_Store
    if (fileName === '.DS_Store') return '';
    
    // POSIX path cleanup: convert any backslashes (Windows legacy) to forward slashes
    let sanitized = fileName.replace(/\\/g, '/');
    
    // Remove characters that might be problematic in URLs or different file systems
    sanitized = sanitized.replace(/[#%&{}\\<>*?$/!'":@+`|=]/g, '');
    
    return sanitized;
}

/**
 * Upload an image file to cloud storage (Supabase)
 * @param file The file object to upload
 * @returns Promise with the public URL of the uploaded image
 */
export async function uploadImage(file: File): Promise<string> {
    console.log(`📂 [Storage] Starting upload for file: ${file.name} (${file.size} bytes)`);
    
    const cleanName = sanitizeFileName(file.name);
    if (!cleanName && file.name === '.DS_Store') {
        throw new Error('Skipping .DS_Store metadata file.');
    }

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
    // Use path.posix.join to ensure forward slashes regardless of OS (for Supabase)
    const fileName = `${Date.now()}-${uniqueId}.${fileExt}`;
    const filePath = path.posix.join(fileName);

    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true  // Allow retry/overwrite to avoid duplicate-key errors
            });

        if (error) {
            console.error('❌ Supabase Upload Error:', error);
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        console.log(`✅ [Storage] Upload successful. Public URL: ${publicUrl}`);
        return publicUrl;
    } catch (error) {
        console.error('❌ Storage Adapter Error:', error);
        throw new Error('Failed to upload image to storage');
    }
}

/**
 * TODO: Implement Aliyun OSS storage provider as an alternative to Supabase.
 * This function is intentionally unimplemented (dead code) until Aliyun credentials
 * are provisioned. Do not call this function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function uploadToAliyun(_file: File): Promise<string> {
    throw new Error('Aliyun storage not implemented yet. See TODO above.');
}
