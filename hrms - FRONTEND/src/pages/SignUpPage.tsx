import React from 'react';
import { SignUpForm } from '../components/auth/SignUpForm';

export const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#070913] relative overflow-hidden">
      
      {/* Absolute Ambient Pulsing Gradients in Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#070913]">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-primary/8 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-accent/8 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[35%] right-[15%] w-[35%] h-[35%] rounded-full bg-success/4 blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
