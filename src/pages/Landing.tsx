import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, ArrowRight, Camera, Upload, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [activeTab, setActiveTab] = useState('starter');
  const navigate = useNavigate();

  const pricingTiers = {
    starter: {
      name: '🆓 STARTER',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        '1K API calls/month',
        'Basic KYC, Storage, Notifications',
        'Community support',
        'Standard security'
      ],
      cta: 'Get Started Free'
    },
    professional: {
      name: '💼 PROFESSIONAL',
      price: '$99/month',
      description: 'For growing businesses',
      features: [
        '100K API calls/month',
        'All services included',
        'Email support',
        'Advanced analytics',
        'Priority processing'
      ],
      cta: 'Start Professional Trial'
    },
    enterprise: {
      name: '🏢 ENTERPRISE',
      price: '$999/month',
      description: 'For scale and compliance',
      features: [
        'Unlimited API calls',
        'White-label options',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantees'
      ],
      cta: 'Contact Sales'
    }
  };

  const services = [
    {
      icon: '🔐',
      title: 'KYC/Identity',
      description: 'Complete identity verification with document analysis and facial recognition',
      status: '✅ Live'
    },
    {
      icon: '💳',
      title: 'Payments',
      description: 'Seamless payment processing across APAC markets',
      status: '🎯 Q3 2024'
    },
    {
      icon: '📱',
      title: 'Notifications',
      description: 'Multi-channel push notifications and messaging',
      status: '🎯 Q3 2024'
    },
    {
      icon: '🗄️',
      title: 'Smart Storage',
      description: 'Intelligent file storage with auto-optimization',
      status: '🎯 Q4 2024'
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Real-time insights and performance monitoring',
      status: '✅ Live'
    },
    {
      icon: '🤖',
      title: 'AI Services',
      description: 'Computer vision, NLP, and ML model deployment',
      status: '🚀 2025'
    }
  ];

  const markets = [
    { flag: '🇸🇬', name: 'Singapore', status: 'Fintech hub, regulation-heavy' },
    { flag: '🇮🇩', name: 'Indonesia', status: 'Massive scale, growing tech' },
    { flag: '🇮🇳', name: 'India', status: 'Developer-rich, cost-conscious' },
    { flag: '🇹🇭', name: 'Thailand', status: 'Digital transformation wave' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            🚀 Now Live in APAC Markets
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            AWS Wrapper Suite for
            <span className="text-blue-600"> Mid-Market APAC</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Turn AWS complexity into developer joy. One API, endless possibilities. 
            Built for Asia's fastest-growing companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3" onClick={() => navigate('/kyc')}>
              Start Building Free <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3" onClick={() => navigate('/demo')}>
              View Live Demo
            </Button>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">$133B</div>
              <div className="text-sm text-gray-600">APAC Cloud Market by 2025</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">200K+</div>
              <div className="text-sm text-gray-600">Mid-market Companies</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">28%</div>
              <div className="text-sm text-gray-600">Annual Growth Rate</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">10x</div>
              <div className="text-sm text-gray-600">Faster Integration</div>
            </CardContent>
          </Card>
        </div>

        {/* Code Example */}
        <Card className="mb-16 bg-gray-900 text-white">
          <CardHeader>
            <CardTitle className="text-white">⚡ Developer Experience That Sparks Joy</CardTitle>
            <CardDescription className="text-gray-300">
              Replace 50 lines of AWS boilerplate with one beautiful line
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="text-red-400 text-sm mb-2">❌ AWS Nightmare</div>
                <pre className="text-xs bg-gray-800 p-4 rounded overflow-x-auto">
{`import AWS from 'aws-sdk';
const s3 = new AWS.S3({...config});
const lambda = new AWS.Lambda({...config});
// + 50 lines of boilerplate

s3.upload(params, (err, data) => {
  if (err) throw err;
  lambda.invoke({...}, callback);
});`}
                </pre>
              </div>
              <div>
                <div className="text-green-400 text-sm mb-2">✅ Your API Magic</div>
                <pre className="text-xs bg-gray-800 p-4 rounded overflow-x-auto">
{`import { YourAPI } from '@yourapi/sdk';
const api = new YourAPI('your-key');

// One-liner magic
await api.storage.upload(file, { 
  resize: '1024x768', 
  format: 'webp' 
});

await api.kyc.verify({ email, idImage, selfie });`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Suite */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">🛠️ Complete Product Suite</h2>
            <p className="text-xl text-gray-600">Everything you need to build, scale, and succeed</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl">{service.icon}</div>
                    <Badge variant="secondary" className="text-xs">
                      {service.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Target Markets */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">🌏 Strategic Markets</h2>
            <p className="text-xl text-gray-600">Targeting Asia's hottest tech ecosystems</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {markets.map((market, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-3">{market.flag}</div>
                  <h3 className="font-semibold text-lg mb-2">{market.name}</h3>
                  <p className="text-sm text-gray-600">{market.status}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">💰 Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Scale as you grow, pay as you succeed</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {Object.keys(pricingTiers).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setActiveTab(tier)}
                  className={`px-6 py-2 rounded-md transition-all ${
                    activeTab === tier
                      ? 'bg-white shadow-sm text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {pricingTiers[tier as keyof typeof pricingTiers].name}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {pricingTiers[activeTab as keyof typeof pricingTiers].name}
                </CardTitle>
                <div className="text-4xl font-bold text-blue-600 my-4">
                  {pricingTiers[activeTab as keyof typeof pricingTiers].price}
                </div>
                <CardDescription>
                  {pricingTiers[activeTab as keyof typeof pricingTiers].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {pricingTiers[activeTab as keyof typeof pricingTiers].features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check size={16} className="text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  {pricingTiers[activeTab as keyof typeof pricingTiers].cta}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Infrastructure?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of developers building the future of APAC tech
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
