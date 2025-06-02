
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Play, Check, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const LiveDemo = () => {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const baseUrl = 'https://aws-kyc-verification.onrender.com';

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    toast({
      title: "Code Copied!",
      description: "SDK code has been copied to clipboard",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const javascriptCode = `// 🌈 KYC SDK - Pure JavaScript Implementation
import { KYCClient } from '@aws-wrapper-suite/kyc-sdk';

// 🔑 Initialize SDK
const kyc = new KYCClient({
  baseURL: '${baseUrl}',
  timeout: 30000
});

// 🚀 Generate API Key
async function generateApiKey() {
  try {
    const response = await fetch('${baseUrl}/api-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    if (data.success) {
      console.log('✅ API Key:', data.api_key);
      console.log('⏰ Expires:', data.expires);
      return data.api_key;
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// 🔍 KYC Verification
async function verifyKYC(email, idImage, selfie, apiKey) {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('id_image', idImage);
  formData.append('selfie', selfie);

  const response = await fetch('${baseUrl}/kyc', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${apiKey}\`
    },
    body: formData
  });

  const result = await response.json();
  
  if (result.success && result.verified) {
    console.log(\`🎉 Verification Success! \${result.similarity}% match\`);
  }
  
  return result;
}

// 📱 Complete Integration Example
async function runKYCDemo() {
  // Step 1: Get API Key
  const apiKey = await generateApiKey();
  
  // Step 2: Get user inputs
  const email = 'demo@example.com';
  const idFile = document.getElementById('idImage').files[0];
  const selfieFile = document.getElementById('selfie').files[0];
  
  // Step 3: Verify
  const result = await verifyKYC(email, idFile, selfieFile, apiKey);
  
  // Step 4: Handle result
  if (result.verified) {
    showSuccess(\`Identity verified with \${result.similarity}% confidence\`);
  } else {
    showError(result.error || 'Verification failed');
  }
}`;

  const reactCode = `// ⚛️ React Hook Implementation
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const useKYCVerification = () => {
  const [apiKey, setApiKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 🔑 Generate API Key
  const generateApiKey = useCallback(async () => {
    try {
      const response = await fetch('${baseUrl}/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.success) {
        setApiKey(data.api_key);
        return data.api_key;
      }
    } catch (error) {
      toast.error('Failed to generate API key');
      throw error;
    }
  }, []);

  // 🚀 KYC Verification
  const verifyKYC = useCallback(async (request) => {
    setIsLoading(true);
    try {
      let currentApiKey = apiKey;
      if (!currentApiKey) {
        currentApiKey = await generateApiKey();
      }

      const formData = new FormData();
      formData.append('email', request.email);
      formData.append('id_image', request.idImage);
      formData.append('selfie', request.selfie);

      const response = await fetch('${baseUrl}/kyc', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${currentApiKey}\`
        },
        body: formData
      });

      const data = await response.json();
      setResult(data);

      if (data.success && data.verified) {
        toast.success(\`✅ Verified! \${data.similarity}% match\`);
      } else {
        toast.error(data.error || 'Verification failed');
      }

      return data;
    } catch (error) {
      toast.error('Verification error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, generateApiKey]);

  return { verifyKYC, isLoading, result, hasApiKey: !!apiKey };
};

// 📱 Component Usage
const KYCDemo = () => {
  const { verifyKYC, isLoading, result } = useKYCVerification();
  
  const handleSubmit = async (formData) => {
    await verifyKYC({
      email: formData.email,
      idImage: formData.idFile,
      selfie: formData.selfieFile
    });
  };

  return (
    <div className="kyc-demo">
      <form onSubmit={handleSubmit}>
        {/* Your form fields */}
        <button disabled={isLoading}>
          {isLoading ? '🔄 Verifying...' : '🚀 Verify Identity'}
        </button>
      </form>
      
      {result && (
        <div className="result">
          {result.verified ? '✅ Success!' : '❌ Failed'}
        </div>
      )}
    </div>
  );
};`;

  const pythonCode = `# 🐍 Python SDK Implementation
import requests
import json
from typing import Optional, Dict, Any

class KYCClient:
    def __init__(self, base_url: str = "${baseUrl}"):
        self.base_url = base_url
        self.session = requests.Session()
        self.api_key: Optional[str] = None
    
    def generate_api_key(self) -> Dict[str, Any]:
        """🔑 Generate a new API key"""
        try:
            response = self.session.post(f"{self.base_url}/api-key")
            data = response.json()
            
            if data.get('success'):
                self.api_key = data['api_key']
                print(f"✅ API Key generated: {data['api_key'][:20]}...")
                print(f"⏰ Expires: {data['expires']}")
                return data
            else:
                raise Exception(f"Failed to generate API key: {data}")
                
        except Exception as e:
            print(f"❌ Error generating API key: {e}")
            raise
    
    def verify_kyc(self, email: str, id_image_path: str, 
                   selfie_path: str) -> Dict[str, Any]:
        """🔍 Perform KYC verification"""
        if not self.api_key:
            self.generate_api_key()
        
        try:
            # Prepare files
            files = {
                'id_image': open(id_image_path, 'rb'),
                'selfie': open(selfie_path, 'rb')
            }
            
            # Prepare data
            data = {'email': email}
            
            # Make request
            headers = {'Authorization': f'Bearer {self.api_key}'}
            response = self.session.post(
                f"{self.base_url}/kyc",
                headers=headers,
                files=files,
                data=data
            )
            
            result = response.json()
            
            # Handle response
            if result.get('success') and result.get('verified'):
                print(f"🎉 Verification successful!")
                print(f"📊 Similarity: {result.get('similarity')}%")
                print(f"💬 Message: {result.get('message')}")
            else:
                print(f"❌ Verification failed: {result.get('error')}")
            
            return result
            
        except Exception as e:
            print(f"❌ KYC verification error: {e}")
            raise
        finally:
            # Close files
            for file in files.values():
                file.close()

# 🚀 Usage Example
def main():
    # Initialize client
    kyc = KYCClient()
    
    # Perform KYC verification
    result = kyc.verify_kyc(
        email="demo@example.com",
        id_image_path="./id_document.jpg",
        selfie_path="./selfie.jpg"
    )
    
    # Process result
    if result.get('verified'):
        print("✅ User is verified!")
    else:
        print("❌ Verification failed")

if __name__ == "__main__":
    main()`;

  const curlCode = `# 🌐 cURL Examples for Direct API Testing

# 🔑 Step 1: Generate API Key
curl -X POST "${baseUrl}/api-key" \\
  -H "Content-Type: application/json" \\
  -w "\\n%{http_code}\\n"

# Expected Response:
# {
#   "success": true,
#   "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "expires": "2025-07-03T10:30:45Z"
# }

# 🔍 Step 2: KYC Verification
curl -X POST "${baseUrl}/kyc" \\
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \\
  -F "email=demo@example.com" \\
  -F "id_image=@./id_document.jpg" \\
  -F "selfie=@./selfie.jpg" \\
  -w "\\n%{http_code}\\n"

# ✅ Success Response:
# {
#   "success": true,
#   "verified": true,
#   "similarity": 87.5,
#   "message": "KYC verification successful with 87.5% similarity"
# }

# ❌ Error Response:
# {
#   "success": false,
#   "error": "KYC with this email is already done successfully"
# }

# 🚨 Common Error Codes:
# 400 - Bad Request (missing fields, invalid data)
# 401 - Unauthorized (invalid/expired API key)
# 429 - Too Many Requests (rate limit exceeded)
# 500 - Internal Server Error

# 💡 Pro Tips:
# - Use high-quality images (min 300x300px)
# - Ensure good lighting in photos
# - Support JPG/PNG formats only
# - Max file size: 5MB per image
# - API keys expire after 30 days`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-white hover:text-blue-300"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Button>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            🟢 API Status: Live
          </Badge>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🚀 Live KYC API Demo
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Interactive examples and SDK implementations for instant integration
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={() => navigate('/kyc')} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play size={16} className="mr-2" />
              Try Interactive Demo
            </Button>
          </div>
        </div>

        {/* API Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">Base URL</h3>
                <code className="text-blue-300 text-sm bg-black/30 px-2 py-1 rounded">
                  {baseUrl}
                </code>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🔑</div>
                <h3 className="font-semibold mb-2">Authentication</h3>
                <p className="text-sm text-gray-300">JWT Bearer Tokens</p>
                <p className="text-xs text-gray-400">30-day expiration</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold mb-2">Response Format</h3>
                <p className="text-sm text-gray-300">JSON with similarity scores</p>
                <p className="text-xs text-gray-400">Real-time verification</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SDK Examples */}
        <Card className="bg-white/5 border-white/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              💻 Developer SDK Examples
            </CardTitle>
            <CardDescription className="text-gray-300">
              Production-ready code samples for instant integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="javascript" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/10">
                <TabsTrigger value="javascript" className="text-white data-[state=active]:bg-blue-600">
                  JavaScript
                </TabsTrigger>
                <TabsTrigger value="react" className="text-white data-[state=active]:bg-blue-600">
                  React Hook
                </TabsTrigger>
                <TabsTrigger value="python" className="text-white data-[state=active]:bg-blue-600">
                  Python
                </TabsTrigger>
                <TabsTrigger value="curl" className="text-white data-[state=active]:bg-blue-600">
                  cURL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="javascript" className="mt-6">
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-4 right-4 z-10"
                    onClick={() => copyToClipboard(javascriptCode, 'javascript')}
                  >
                    {copiedCode === 'javascript' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedCode === 'javascript' ? 'Copied!' : 'Copy'}
                  </Button>
                  <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto text-sm leading-relaxed">
                    <code>{javascriptCode}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="react" className="mt-6">
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-4 right-4 z-10"
                    onClick={() => copyToClipboard(reactCode, 'react')}
                  >
                    {copiedCode === 'react' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedCode === 'react' ? 'Copied!' : 'Copy'}
                  </Button>
                  <pre className="bg-gray-900 text-cyan-400 p-6 rounded-lg overflow-x-auto text-sm leading-relaxed">
                    <code>{reactCode}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="python" className="mt-6">
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-4 right-4 z-10"
                    onClick={() => copyToClipboard(pythonCode, 'python')}
                  >
                    {copiedCode === 'python' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedCode === 'python' ? 'Copied!' : 'Copy'}
                  </Button>
                  <pre className="bg-gray-900 text-yellow-400 p-6 rounded-lg overflow-x-auto text-sm leading-relaxed">
                    <code>{pythonCode}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="curl" className="mt-6">
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-4 right-4 z-10"
                    onClick={() => copyToClipboard(curlCode, 'curl')}
                  >
                    {copiedCode === 'curl' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedCode === 'curl' ? 'Copied!' : 'Copy'}
                  </Button>
                  <pre className="bg-gray-900 text-orange-400 p-6 rounded-lg overflow-x-auto text-sm leading-relaxed">
                    <code>{curlCode}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Integration Tips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-400/30 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                🛡️ Security Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Store API keys securely (environment variables)</p>
              <p>• Implement proper error handling</p>
              <p>• Use HTTPS for all requests</p>
              <p>• Validate images before upload</p>
              <p>• Implement rate limiting on your end</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-teal-600/20 border-green-400/30 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                ⚡ Performance Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Compress images before upload</p>
              <p>• Use connection pooling</p>
              <p>• Implement retry logic with exponential backoff</p>
              <p>• Cache API keys until expiration</p>
              <p>• Monitor response times</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Integrate?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start building with our KYC API in minutes, not months
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/kyc')}>
              Try Interactive Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDemo;
