// Local image storage service for image management
// This service handles local file storage in the public/uploads directory

export interface ImageUploadResult {
  url: string;
  filename: string;
  size: number;
  uploadedAt: Date;
}

export interface ImageUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

class LocalImageStorageService {
  private readonly defaultOptions: Required<ImageUploadOptions> = {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  };

  private readonly baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  /**
   * Upload an image via API route (client-side safe)
   */
  async uploadImage(
    file: File,
    options: ImageUploadOptions = {}
  ): Promise<ImageUploadResult> {
    // This method uses API routes for server-side file handling
    throw new Error('Use API routes for image upload. Call /api/upload endpoint instead.');
  }

  /**
   * Generate unique filename for uploaded image
   */
  generateFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const baseName = originalName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    return `${baseName}-${timestamp}-${randomString}.${extension}`;
  }

  /**
   * Get image URL for local storage
   */
  getImageUrl(filename: string): string {
    if (!filename) return '';
    // Return relative URL for Next.js static file serving
    return `/uploads/${filename}`;
  }

  /**
   * Delete an image by filename
   */
  async deleteImage(filename: string): Promise<boolean> {
    // This method uses API routes for server-side file handling
    throw new Error('Use API routes for image deletion. Call /api/delete endpoint instead.');
  }

  /**
   * Validate image file before upload
   */
  validateImageFile(file: File, options: ImageUploadOptions = {}): { valid: boolean; error?: string } {
    const opts = { ...this.defaultOptions, ...options };

    if (!opts.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${opts.allowedTypes.join(', ')}`
      };
    }

    if (file.size > opts.maxSize) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${opts.maxSize / (1024 * 1024)}MB`
      };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const imageStorage = new LocalImageStorageService();
export default imageStorage;
