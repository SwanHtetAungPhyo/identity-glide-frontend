
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Upload } from 'lucide-react';
import { KYCResponse } from '@/types/kyc';

interface VerificationResultsProps {
  result: KYCResponse;
  onStartOver: () => void;
}

const VerificationResults = ({ result, onStartOver }: VerificationResultsProps) => {
  const isSuccess = result.success && result.verified;
  
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isSuccess ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isSuccess ? (
              <Check size={32} className="text-green-600" />
            ) : (
              <Upload size={32} className="text-red-600" />
            )}
          </div>
          <CardTitle className={`text-2xl font-bold ${
            isSuccess ? 'text-green-900' : 'text-red-900'
          }`}>
            {isSuccess ? 'Verification Successful!' : 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isSuccess ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Your identity has been successfully verified.
                </p>
                {result.similarity && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 font-semibold">
                      Match Confidence: {result.similarity.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your account is now verified</li>
                  <li>• You can access all features</li>
                  <li>• Keep your documents secure</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {result.error || result.message || 'We could not verify your identity at this time.'}
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Common Issues:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Poor image quality or lighting</li>
                  <li>• Documents not clearly visible</li>
                  <li>• Face not clearly visible in selfie</li>
                  <li>• Using expired documents</li>
                </ul>
              </div>
              
              <Button 
                onClick={onStartOver}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
            </div>
          )}
          
          {isSuccess && (
            <Button 
              onClick={onStartOver}
              variant="outline"
              className="w-full"
            >
              Verify Another Identity
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationResults;
