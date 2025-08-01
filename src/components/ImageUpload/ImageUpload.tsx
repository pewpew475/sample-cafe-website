'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useImageUpload, UploadResult } from '@/hooks/useImageUpload';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  type: 'product' | 'category' | 'general';
  id?: string;
  name?: string;
  currentImage?: string;
  onUploadSuccess?: (result: UploadResult) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
  placeholder?: string;
  resetTrigger?: number; // Used to trigger reset from parent
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  type,
  id,
  name,
  currentImage,
  onUploadSuccess,
  onUploadError,
  className = '',
  accept = 'image/*',
  maxSize = 5,
  placeholder = 'Click to upload image or drag and drop',
  resetTrigger = 0
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');

  const { uploadImage, deleteImage, isUploading, progress, error } = useImageUpload({
    onSuccess: (result) => {
      setPreviewUrl(result.url);
      onUploadSuccess?.(result);
    },
    onError: (error) => {
      onUploadError?.(error);
    }
  });

  // Reset when resetTrigger changes
  useEffect(() => {
    if (resetTrigger > 0) {
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [resetTrigger]);

  const handleFileSelect = (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      onUploadError?.(` File too large. Maximum size: ${maxSize}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadImage(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = async () => {
    if (previewUrl && previewUrl !== currentImage) {
      // Extract filename from URL for deletion
      const filename = previewUrl.split('/').pop();
      if (filename) {
        const success = await deleteImage(filename);
        if (success) {
          setPreviewUrl('');
        }
      }
    } else {
      setPreviewUrl('');
    }
  };

  return (
    <div className={`${styles.imageUpload} ${className}`}>
      <div
        className={`${styles.uploadArea} ${dragOver ? styles.dragOver : ''} ${isUploading ? styles.uploading : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className={styles.hiddenInput}
        />

        {previewUrl ? (
          <div className={styles.imagePreview}>
            <img src={previewUrl} alt="Preview" className={styles.previewImage} />
            <div className={styles.imageOverlay}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className={styles.removeButton}
                disabled={isUploading}
              >
                ✕
              </button>
              <button
                type="button"
                onClick={handleClick}
                className={styles.changeButton}
                disabled={isUploading}
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.uploadPrompt}>
            <div className={styles.uploadIcon}>📷</div>
            <p className={styles.uploadText}>{placeholder}</p>
            <p className={styles.uploadHint}>
              Supports: JPG, PNG, WebP, GIF (max {maxSize}MB)
            </p>
          </div>
        )}

        {isUploading && (
          <div className={styles.uploadProgress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress?.percentage || 0}%` }}
              />
            </div>
            <p className={styles.progressText}>
              Uploading... {progress?.percentage || 0}%
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
