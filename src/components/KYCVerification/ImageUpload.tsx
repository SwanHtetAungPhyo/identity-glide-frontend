
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Check } from 'lucide-react';
import { validateImage } from '@/utils/imageValidation';
import { ImageValidation } from '@/types/kyc';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  accept?: string;
  title: string;
  description: string;
  preview?: string;
  isLoading?: boolean;
}

const ImageUpload = ({ 
  onImageSelect, 
  accept = "image/jpeg,image/jpg,image/png",
  title,
  description,
  preview,
  isLoading
}: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [validation, setValidation] = useState<ImageValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsValidating(true);
    setValidation(null);

    try {
      const validationResult = await validateImage(file);
      setValidation(validationResult);

      if (validationResult.isValid) {
        onImageSelect(file);
      }
    } catch (error) {
      setValidation({
        isValid: false,
        errors: ['Failed to validate image']
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
              ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
              ${validation?.isValid ? 'border-green-500 bg-green-50' : ''}
              ${validation && !validation.isValid ? 'border-red-500 bg-red-50' : ''}
              ${isLoading || isValidating ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-blue-400 hover:bg-blue-25'}
            `}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleChange}
              className="hidden"
              disabled={isLoading || isValidating}
            />

            {preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto max-h-48 rounded-lg border"
                />
                <div className="flex items-center justify-center text-green-600">
                  <Check size={20} className="mr-2" />
                  <span className="font-medium">Image uploaded successfully</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                  dragActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Upload size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600 mb-4">{description}</p>
                  <Button 
                    type="button" 
                    variant="outline"
                    disabled={isLoading || isValidating}
                  >
                    {isValidating ? 'Validating...' : 'Choose File'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {validation && (
            <div className="mt-4">
              {validation.isValid ? (
                <div className="flex items-center text-green-600">
                  <Check size={16} className="mr-2" />
                  <span className="text-sm">Image validation passed</span>
                  {validation.quality && (
                    <span className="ml-2 text-xs bg-green-100 px-2 py-1 rounded">
                      Quality: {Math.round(validation.quality)}%
                    </span>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  {validation.errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-600">
                      • {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500">
            <p>Supported formats: JPG, PNG • Max size: 5MB</p>
            <p>For best results: Good lighting, clear focus, minimum 300x300px</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUpload;
