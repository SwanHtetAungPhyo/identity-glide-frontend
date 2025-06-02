
import { ImageValidation } from '@/types/kyc';

export const validateImage = async (file: File): Promise<ImageValidation> => {
  const errors: string[] = [];
  
  // Check file type
  if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
    errors.push('Please upload a JPG or PNG image');
  }
  
  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    errors.push('Image size must be less than 5MB');
  }
  
  try {
    // Create image element to check dimensions and quality
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    
    return new Promise((resolve) => {
      img.onload = () => {
        URL.revokeObjectURL(imageUrl);
        
        // Check minimum dimensions
        if (img.width < 300 || img.height < 300) {
          errors.push('Image must be at least 300x300 pixels');
        }
        
        // Calculate a simple quality score based on file size and dimensions
        const quality = Math.min(100, (file.size / (img.width * img.height)) * 1000);
        
        if (quality < 30) {
          errors.push('Image quality is too low');
        }
        
        resolve({
          isValid: errors.length === 0,
          errors,
          quality
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        errors.push('Invalid image file');
        resolve({
          isValid: false,
          errors
        });
      };
      
      img.src = imageUrl;
    });
  } catch (error) {
    errors.push('Failed to process image');
    return {
      isValid: false,
      errors
    };
  }
};

export const compressImage = (file: File, maxWidth: number = 1024, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      }, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
