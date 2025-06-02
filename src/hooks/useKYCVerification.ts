
import { useState, useCallback } from 'react';
import { ApiKeyResponse, KYCRequest, KYCResponse } from '@/types/kyc';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://aws-kyc-verification.onrender.com';

export const useKYCVerification = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<KYCResponse | null>(null);

  const generateApiKey = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiKeyResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to generate API key');
      }

      setApiKey(data.api_key);
      return data.api_key;
    } catch (error) {
      console.error('Error generating API key:', error);
      throw new Error('Failed to generate API key. Please try again.');
    }
  }, []);

  const verifyKYC = useCallback(async (request: KYCRequest): Promise<KYCResponse> => {
    setIsLoading(true);
    setResult(null);

    try {
      let currentApiKey = apiKey;
      
      if (!currentApiKey) {
        currentApiKey = await generateApiKey();
      }

      const formData = new FormData();
      formData.append('email', request.email);
      formData.append('id_image', request.id_image);
      formData.append('selfie', request.selfie);

      const response = await fetch(`${API_BASE_URL}/kyc`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentApiKey}`
        },
        body: formData
      });

      const data: KYCResponse = await response.json();

      if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setResult(data);

      if (data.success && data.verified) {
        toast({
          title: "Verification Successful!",
          description: `Identity verified with ${data.similarity?.toFixed(1)}% similarity`,
        });
      } else if (data.success && !data.verified) {
        toast({
          title: "Verification Failed",
          description: data.message || "Identity could not be verified",
          variant: "destructive",
        });
      }

      return data;
    } catch (error) {
      console.error('KYC verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      
      const errorResult: KYCResponse = {
        success: false,
        error: errorMessage
      };
      
      setResult(errorResult);
      
      toast({
        title: "Verification Error",
        description: errorMessage,
        variant: "destructive",
      });

      return errorResult;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, generateApiKey]);

  const resetVerification = useCallback(() => {
    setResult(null);
    setIsLoading(false);
  }, []);

  return {
    verifyKYC,
    resetVerification,
    isLoading,
    result,
    hasApiKey: !!apiKey
  };
};
