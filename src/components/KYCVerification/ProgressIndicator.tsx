
import { Check } from 'lucide-react';
import { VerificationStep } from '@/types/kyc';

interface ProgressIndicatorProps {
  steps: VerificationStep[];
}

const ProgressIndicator = ({ steps }: ProgressIndicatorProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ 
              width: `${(steps.filter(s => s.completed).length / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>
        
        {/* Steps */}
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${step.completed 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : step.current 
                    ? 'bg-white border-blue-600 text-blue-600' 
                    : 'bg-white border-gray-300 text-gray-400'
                }
              `}
            >
              {step.completed ? (
                <Check size={20} />
              ) : (
                <span className="text-sm font-semibold">{step.id}</span>
              )}
            </div>
            
            <div className="mt-2 text-center max-w-24">
              <div
                className={`
                  text-sm font-medium
                  ${step.current ? 'text-blue-600' : step.completed ? 'text-gray-900' : 'text-gray-400'}
                `}
              >
                {step.title}
              </div>
              <div
                className={`
                  text-xs mt-1
                  ${step.current ? 'text-blue-500' : 'text-gray-400'}
                `}
              >
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
