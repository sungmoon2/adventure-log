import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFormats?: string[];
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export function ImageUploader({
  onUpload,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
}: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return 'Invalid file format. Please upload an image (JPG, PNG, WebP).';
    }

    if (file.size > maxSize) {
      return `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`;
    }

    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    if (fileArray.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} files allowed`);
      return;
    }

    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    setErrors(newErrors);

    if (validFiles.length > 0) {
      // Simulate upload progress
      const progress: UploadProgress[] = validFiles.map((file) => ({
        fileName: file.name,
        progress: 0,
        status: 'uploading',
      }));

      setUploadProgress(progress);

      // Simulate progress
      validFiles.forEach((file, index) => {
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress += 10;
          if (currentProgress >= 100) {
            clearInterval(interval);
            setUploadProgress((prev) =>
              prev.map((p, i) =>
                i === index ? { ...p, progress: 100, status: 'complete' } : p
              )
            );
          } else {
            setUploadProgress((prev) =>
              prev.map((p, i) =>
                i === index ? { ...p, progress: currentProgress } : p
              )
            );
          }
        }, 200);
      });

      onUpload(validFiles);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-white hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Choose files to upload"
        />

        <div className="text-gray-600">
          <p className="text-lg mb-2">
            Drag & drop images here, or click to select
          </p>
          <p className="text-sm">
            Maximum {maxFiles} files, up to {maxSize / (1024 * 1024)}MB each
          </p>
          <p className="text-xs mt-1">
            Supported formats: JPG, PNG, WebP
          </p>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-4">
          {errors.map((error, index) => (
            <p key={index} className="text-red-500 text-sm">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadProgress.map((progress, index) => (
            <div key={index} className="bg-white p-3 rounded border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{progress.fileName}</span>
                <span className="text-sm text-gray-600">
                  {progress.status === 'uploading'
                    ? `${progress.progress}%`
                    : progress.status}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
