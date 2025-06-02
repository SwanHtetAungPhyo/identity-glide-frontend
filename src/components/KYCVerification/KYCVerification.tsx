
import { useState, useMemo } from 'react';
import { VerificationStep } from '@/types/kyc';
import { useKYCVerification } from '@/hooks/useKYCVerification';
import ProgressIndicator from './ProgressIndicator';
import EmailStep from './EmailStep';
import ImageUpload from './ImageUpload';
import CameraCapture from './CameraCapture';
import VerificationResults from './VerificationResults';
import { Button } from '@/components/ui/button';

const KYCVerification = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [idImage, setIdImage] = useState<File | null>(null);
  const [idImagePreview, setIdImagePreview] = useState<string>('');
  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [selfieImagePreview, setSelfieImagePreview] = useState<string>('');
  
  const { verifyKYC, resetVerification, isLoading, result } = useKYCVerification();

  const steps: VerificationStep[] = useMemo(() => [
    {
      id: 1,
      title: 'Email',
      description: 'Enter email',
      completed: currentStep > 1,
      current: currentStep === 1
    },
    {
      id: 2,
      title: 'ID Document',
      description: 'Upload ID',
      completed: currentStep > 2,
      current: currentStep === 2
    },
    {
      id: 3,
      title: 'Selfie',
      description: 'Take photo',
      completed: currentStep > 3,
      current: currentStep === 3
    },
    {
      id: 4,
      title: 'Verification',
      description: 'Processing',
      completed: !!result,
      current: currentStep === 4
    }
  ], [currentStep, result]);

  const handleEmailNext = (emailValue: string) => {
    setEmail(emailValue);
    setCurrentStep(2);
  };

  const handleIdImageSelect = (file: File) => {
    setIdImage(file);
    setIdImagePreview(URL.createObjectURL(file));
  };

  const handleIdNext = () => {
    if (idImage) {
      setCurrentStep(3);
    }
  };

  const handleSelfieCapture = (file: File) => {
    setSelfieImage(file);
    setSelfieImagePreview(URL.createObjectURL(file));
  };

  const handleSelfieNext = async () => {
    if (email && idImage && selfieImage) {
      setCurrentStep(4);
      await verifyKYC({
        email,
        id_image: idImage,
        selfie: selfieImage
      });
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setEmail('');
    setIdImage(null);
    setIdImagePreview('');
    setSelfieImage(null);
    setSelfieImagePreview('');
    resetVerification();
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Identity Verification
          </h1>
          <p className="text-gray-600">
            Secure and fast KYC verification process
          </p>
        </div>

        <ProgressIndicator steps={steps} />

        <div className="max-w-2xl mx-auto mt-8">
          {currentStep === 1 && (
            <EmailStep onNext={handleEmailNext} isLoading={isLoading} />
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload ID Document
                </h2>
                <p className="text-gray-600">
                  Please upload a clear photo of your government-issued ID
                </p>
              </div>
              
              <ImageUpload
                title="Government-Issued ID"
                description="Upload your passport, driver's license, or national ID card"
                onImageSelect={handleIdImageSelect}
                preview={idImagePreview}
                isLoading={isLoading}
              />
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="flex-1"
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleIdNext}
                  disabled={!idImage}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Take Your Selfie
                </h2>
                <p className="text-gray-600">
                  We'll compare this photo with your ID document
                </p>
              </div>
              
              {selfieImagePreview ? (
                <ImageUpload
                  title="Selfie Captured"
                  description="Your selfie has been captured successfully"
                  onImageSelect={handleSelfieCapture}
                  preview={selfieImagePreview}
                  isLoading={isLoading}
                />
              ) : (
                <CameraCapture
                  onCapture={handleSelfieCapture}
                  isLoading={isLoading}
                />
              )}
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="flex-1"
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleSelfieNext}
                  disabled={!selfieImage || isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Verifying...' : 'Verify Identity'}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 4 && result && (
            <VerificationResults 
              result={result} 
              onStartOver={handleStartOver}
            />
          )}

          {currentStep === 4 && !result && (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Verifying Your Identity
              </h3>
              <p className="text-gray-600">
                Please wait while we process your documents...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
