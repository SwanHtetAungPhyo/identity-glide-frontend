
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Play, Check, Copy, Terminal, Code2, Zap } from 'lucide-react';
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

  const SyntaxHighlighter = ({ children, language }: { children: string; language: string }) => {
    const highlightCode = (code: string, lang: string) => {
      const lines = code.split('\n');
      return lines.map((line, index) => {
        let highlightedLine = line;
        
        // Comments
        highlightedLine = highlightedLine.replace(/(\/\/.*|#.*)/g, '<span class="text-gray-500 italic">$1</span>');
        
        // Keywords
        const keywords = ['import', 'export', 'const', 'let', 'var', 'function', 'async', 'await', 'try', 'catch', 'if', 'else', 'return', 'class', 'def', 'from'];
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
          highlightedLine = highlightedLine.replace(regex, '<span class="text-purple-400 font-medium">$1</span>');
        });
        
        // Strings
        highlightedLine = highlightedLine.replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-400">$1$2$3</span>');
        
        // Numbers
        highlightedLine = highlightedLine.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>');
        
        // Functions/methods
        highlightedLine = highlightedLine.replace(/(\w+)(\()/g, '<span class="text-blue-400">$1</span>$2');
        
        // Properties
        highlightedLine = highlightedLine.replace(/\.(\w+)/g, '.<span class="text-cyan-400">$1</span>');
        
        // Variables in template literals
        highlightedLine = highlightedLine.replace(/\$\{([^}]+)\}/g, '<span class="text-yellow-300">${$1}</span>');
        
        return (
          <div key={index} className="table-row">
            <span className="table-cell text-gray-600 pr-4 text-right select-none w-8">
              {index + 1}
            </span>
            <span 
              className="table-cell pl-4"
              dangerouslySetInnerHTML={{ __html: highlightedLine }}
            />
          </div>
        );
      });
    };

    return (
      <div className="bg-gray-950 rounded-lg overflow-hidden border border-gray-800">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <Code2 size={14} />
            <span>{language}</span>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <div className="table w-full font-mono text-sm leading-relaxed">
            {highlightCode(children, language)}
          </div>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-green-400 hover:bg-gray-800"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Button>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              API Status: Live
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Terminal className="w-16 h-16 text-green-400" />
              <Zap className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Live KYC API Demo
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Production-ready SDK examples with real syntax highlighting. 
            Copy, paste, and start building instantly.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={() => navigate('/kyc')} 
              className="bg-green-600 hover:bg-green-700 text-black font-medium"
            >
              <Play size={16} className="mr-2" />
              Try Interactive Demo
            </Button>
          </div>
        </div>

        {/* API Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2 text-gray-200">Base URL</h3>
                <code className="text-green-400 text-sm bg-gray-950 px-3 py-2 rounded border border-gray-800">
                  {baseUrl}
                </code>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🔑</div>
                <h3 className="font-semibold mb-2 text-gray-200">Authentication</h3>
                <p className="text-sm text-gray-400">JWT Bearer Tokens</p>
                <p className="text-xs text-gray-500">30-day expiration</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold mb-2 text-gray-200">Response Format</h3>
                <p className="text-sm text-gray-400">JSON with similarity scores</p>
                <p className="text-xs text-gray-500">Real-time verification</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SDK Examples */}
        <Card className="bg-gray-900/30 border-gray-800 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-gray-200 flex items-center">
              <Code2 className="mr-3 text-green-400" />
              Developer SDK Examples
            </CardTitle>
            <CardDescription className="text-gray-400">
              Production-ready code samples with beautiful syntax highlighting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="javascript" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-gray-700">
                <TabsTrigger value="javascript" className="text-gray-300 data-[state=active]:bg-green-600 data-[state=active]:text-black">
                  JavaScript
                </TabsTrigger>
                <TabsTrigger value="react" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  React Hook
                </TabsTrigger>
                <TabsTrigger value="python" className="text-gray-300 data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
                  Python
                </TabsTrigger>
                <TabsTrigger value="curl" className="text-gray-300 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                  cURL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="javascript" className="mt-6">
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-4 right-4 z-10 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                    onClick={() => copyToClipboard(javascriptCode, 'javascript')}
                  >
                    {copiedCode === 'javascript' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedCode === 'javascript' ? 'Copied!' : 'Copy'}
                  </Button>
                  <SyntaxHighlighter language="javascript">
                    {javascriptCode}
                  </SyntaxHighlighter>
                </div>
              </TabsContent>

              <TabsContent value="react" className="mt-6">
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-4 right-4 z-10 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                    onClick={() => copyToClipboard(reactCode, 'react')}
                  >
                    {copiedCode === 'react' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedCode === 'react' ? 'Copied!' : 'Copy'}
                  </Button>
                  <SyntaxHighlighter language="jsx">
                    {reactCode}
                  </SyntaxHighlighter>
                </div>
              </TabsContent>

              <TabsContent value="python" className="mt-6">
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-4 right-4 z-10 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                    onClick={() => copyToClipboard(pythonCode, 'python')}
                  >
                    {copiedCode === 'python' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedCode === 'python' ? 'Copied!' : 'Copy'}
                  </Button>
                  <SyntaxHighlighter language="python">
                    {pythonCode}
                  </SyntaxHighlighter>
                </div>
              </TabsContent>

              <TabsContent value="curl" className="mt-6">
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-4 right-4 z-10 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                    onClick={() => copyToClipboard(curlCode, 'curl')}
                  >
                    {copiedCode === 'curl' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedCode === 'curl' ? 'Copied!' : 'Copy'}
                  </Button>
                  <SyntaxHighlighter language="bash">
                    {curlCode}
                  </SyntaxHighlighter>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Integration Tips */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-200">
                🛡️ Security Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-300">
              <p>• Store API keys securely (environment variables)</p>
              <p>• Implement proper error handling</p>
              <p>• Use HTTPS for all requests</p>
              <p>• Validate images before upload</p>
              <p>• Implement rate limiting on your end</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-teal-900/20 border-green-800/30">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-200">
                ⚡ Performance Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-300">
              <p>• Compress images before upload</p>
              <p>• Use connection pooling</p>
              <p>• Implement retry logic with exponential backoff</p>
              <p>• Cache API keys until expiration</p>
              <p>• Monitor response times</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-green-900/40 to-blue-900/40 rounded-2xl p-12 border border-gray-800">
          <h2 className="text-4xl font-bold text-gray-200 mb-4">Ready to Integrate?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Start building with our KYC API in minutes, not months
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-black font-medium" onClick={() => navigate('/kyc')}>
              Try Interactive Demo
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDemo;
