
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EmailStepProps {
  onNext: (email: string) => void;
  isLoading?: boolean;
}

const EmailStep = ({ onNext, isLoading }: EmailStepProps) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors: string[] = [];

    if (!email.trim()) {
      newErrors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      newErrors.push('Please enter a valid email address');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      onNext(email);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Start Verification
          </CardTitle>
          <CardDescription>
            Enter your email address to begin the KYC verification process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.length > 0 ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-600">
                  {error}
                </p>
              ))}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">What you'll need:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Government-issued ID document</li>
              <li>• Clear selfie photo</li>
              <li>• Good lighting conditions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailStep;
