
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  isLoading?: boolean;
}

const CameraCapture = ({ onCapture, isLoading }: CameraCaptureProps) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            setCapturedImage(imageUrl);
            onCapture(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  }, [onCapture, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  if (hasPermission === false) {
    return (
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <Camera size={32} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Access Required</h3>
            <p className="text-gray-600 mb-4">
              Please allow camera access to capture your selfie, or upload an image instead.
            </p>
            <div className="space-y-2">
              <Button onClick={startCamera} className="w-full">
                Try Again
              </Button>
              <Button variant="outline" className="w-full">
                <Upload size={16} className="mr-2" />
                Upload Image Instead
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          {capturedImage ? (
            <div className="text-center space-y-4">
              <img
                src={capturedImage}
                alt="Captured selfie"
                className="mx-auto max-h-64 rounded-lg border"
              />
              <div className="flex gap-2 justify-center">
                <Button onClick={retakePhoto} variant="outline">
                  Retake
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Use This Photo
                </Button>
              </div>
            </div>
          ) : isStreaming ? (
            <div className="text-center space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="mx-auto max-h-64 rounded-lg border"
                />
                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Position your face within the frame and click capture
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={stopCamera} variant="outline">
                    Cancel
                  </Button>
                  <Button 
                    onClick={capturePhoto}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    <Camera size={16} className="mr-2" />
                    Capture
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Camera size={32} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Take a Selfie</h3>
                <p className="text-gray-600 mb-4">
                  We need a clear photo of your face to verify your identity
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={startCamera}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    <Camera size={16} className="mr-2" />
                    Start Camera
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Upload size={16} className="mr-2" />
                    Upload Photo Instead
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <canvas ref={canvasRef} className="hidden" />

      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>• Look directly at the camera</p>
        <p>• Ensure good lighting</p>
        <p>• Remove glasses or hats if possible</p>
      </div>
    </div>
  );
};

export default CameraCapture;
