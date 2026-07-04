import React from 'react';
import { SignUpForm } from '../components/auth/SignUpForm';

export const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-72 h-72 rounded-full bg-primary/10 blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-80 h-80 rounded-full bg-accent/10 blur-3xl -z-10" />

      <SignUpForm />
    </div>
  );
};
export default SignUpPage;
