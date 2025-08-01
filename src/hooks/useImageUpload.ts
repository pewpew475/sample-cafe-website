import { useState, useCallback } from 'react';
import authService from '@/services/auth';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  uploadedAt: Date;
}

export interface UseImageUploadOptions {
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: UploadProgress) => void;
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (
    file: File
  ): Promise<UploadResult | null> => {
    setIsUploading(true);
    setError(null);
    setProgress(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      return new Promise<UploadResult | null>(async (resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progressData = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100)
            };
            setProgress(progressData);
            options.onProgress?.(progressData);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              if (response.success) {
                const result = response.data;
                options.onSuccess?.(result);
                resolve(result);
              } else {
                const errorMsg = response.error || 'Upload failed';
                setError(errorMsg);
                options.onError?.(errorMsg);
                reject(new Error(errorMsg));
              }
            } catch (parseError) {
              const errorMsg = 'Invalid response from server';
              setError(errorMsg);
              options.onError?.(errorMsg);
              reject(new Error(errorMsg));
            }
          } else {
            const errorMsg = `Upload failed with status ${xhr.status}`;
            setError(errorMsg);
            options.onError?.(errorMsg);
            reject(new Error(errorMsg));
          }
        });

        xhr.addEventListener('error', () => {
          const errorMsg = 'Network error during upload';
          setError(errorMsg);
          options.onError?.(errorMsg);
          reject(new Error(errorMsg));
        });

        xhr.open('POST', '/api/upload');

        // Add Firebase ID token for authentication
        const token = await authService.getIdToken();
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.send(formData);
      });

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMsg);
      options.onError?.(errorMsg);
      return null;
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  }, [options]);

  const deleteImage = useCallback(async (filename: string): Promise<boolean> => {
    try {
      const token = await authService.getIdToken();
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      const result = await response.json();

      if (result.success) {
        return true;
      } else {
        setError(result.error || 'Delete failed');
        return false;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Delete failed';
      setError(errorMsg);
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(null);
    setError(null);
  }, []);

  return {
    uploadImage,
    deleteImage,
    isUploading,
    progress,
    error,
    reset
  };
};
