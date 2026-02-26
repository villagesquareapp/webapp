'use client';

import React, { useState, FormEvent } from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import PageTitle from 'components/Layouts/PageTitle';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

type DeletionStep = 'credentials' | 'otp' | 'confirm' | 'success';

export default function AccountDeletionPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [otpError, setOtpError] = useState('');
  const [currentStep, setCurrentStep] = useState<DeletionStep>('credentials');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCredentials = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setOtpError('');
  };

  const handleRequestDeletion = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateCredentials()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to verify credentials and send OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Credentials verified, OTP sent to:', formData.email);
      setCurrentStep('otp');
    } catch (error) {
      console.error('Error:', error);
      setErrors({ email: 'Invalid credentials. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('OTP verified:', otp);
      setCurrentStep('confirm');
    } catch (error) {
      console.error('Error:', error);
      setOtpError('Invalid OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDeletion = async () => {
    setIsSubmitting(true);

    try {
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Account deleted for:', formData.email);
      setCurrentStep('success');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCredentialsStep = () => (
    <form onSubmit={handleRequestDeletion}>
      <div className="mb-5">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className={`w-full px-4 py-3.5 bg-slate-700/50 border ${
            errors.email ? 'border-red-500' : 'border-transparent'
          } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:bg-slate-700/70 focus:border-blue-500 transition-all`}
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1.5">{errors.email}</p>
        )}
      </div>

      <div className="mb-6">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className={`w-full px-4 py-3.5 bg-slate-700/50 border ${
            errors.password ? 'border-red-500' : 'border-transparent'
          } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:bg-slate-700/70 focus:border-blue-500 transition-all`}
        />
        {errors.password && (
          <p className="text-red-400 text-sm mt-1.5">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Processing...
          </>
        ) : (
          'Request Deletion'
        )}
      </button>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOtp}>
      <div className="mb-6">
        <p className="text-slate-300 mb-4 text-center">
          We've sent a 6-digit verification code to{' '}
          <span className="text-blue-400 font-medium">{formData.email}</span>
        </p>
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          className={`w-full px-4 py-3.5 bg-slate-700/50 border ${
            otpError ? 'border-red-500' : 'border-transparent'
          } rounded-lg text-white placeholder-slate-500 text-center text-2xl tracking-widest focus:outline-none focus:bg-slate-700/70 focus:border-blue-500 transition-all`}
        />
        {otpError && (
          <p className="text-red-400 text-sm mt-1.5 text-center">{otpError}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || otp.length !== 6}
        className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Verifying...
          </>
        ) : (
          'Verify OTP'
        )}
      </button>

      <button
        type="button"
        onClick={() => setCurrentStep('credentials')}
        className="w-full mt-3 py-2 text-slate-400 hover:text-slate-300 transition-colors"
      >
        Back to login
      </button>
    </form>
  );

  const renderConfirmStep = () => (
    <div>
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-red-400 font-semibold mb-2">Warning: This action is permanent</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Once you delete your account, there is no going back. All your data will be permanently removed from our servers.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <p className="text-slate-300 text-sm">By confirming, you understand that:</p>
        <ul className="space-y-2 text-slate-400 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">•</span>
            <span>Your profile and all associated data will be permanently deleted</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">•</span>
            <span>You will lose access to all your content and connections</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">•</span>
            <span>This action cannot be undone</span>
          </li>
        </ul>
      </div>

      <button
        onClick={handleConfirmDeletion}
        disabled={isSubmitting}
        className="w-full py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Deleting Account...
          </>
        ) : (
          'Confirm Permanent Deletion'
        )}
      </button>

      <button
        type="button"
        onClick={() => setCurrentStep('credentials')}
        disabled={isSubmitting}
        className="w-full mt-3 py-2 text-slate-400 hover:text-slate-300 transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6">
        <div className="bg-green-500/20 p-4 rounded-full">
          <CheckCircle className="text-green-400" size={48} />
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-white mb-3">Account Deleted Successfully</h3>
      <p className="text-slate-300 mb-6">
        Your VillageSquare account has been permanently deleted. We're sorry to see you go.
      </p>
      <p className="text-slate-400 text-sm">
        You will be redirected to the homepage in a few seconds...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5 py-10">
      <PageTitle title="Account Deletion | Village Square" />
      <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-8 md:p-10 max-w-2xl w-full shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-white">
          Account Deletion Request for VillageSquare
        </h1>
        
        {currentStep !== 'success' && (
          <>
            {/* How to Delete Section */}
            <div className="bg-slate-900/60 rounded-xl p-6 mt-8 mb-6">
              <h2 className="text-blue-400 text-lg font-semibold mb-4">How to Delete Your Account</h2>
              <ol className="space-y-2 text-slate-300">
                <li>1. Enter your account credentials below</li>
                <li>2. Verify your identity via OTP sent to your email</li>
                <li>3. Confirm permanent deletion</li>
              </ol>
            </div>

            {/* What We Delete Section */}
            <div className="bg-slate-900/60 rounded-xl p-6 mb-6">
              <h2 className="text-blue-400 text-lg font-semibold mb-4">What We Delete:</h2>
              <ul className="space-y-2 text-slate-300">
                <li>• User profile information</li>
                <li>• Activity history</li>
                <li>• Stored preferences</li>
                <li>• Connected social accounts</li>
              </ul>
            </div>

            {/* What We Retain Section */}
            <div className="bg-slate-900/60 rounded-xl p-6 mb-6">
              <h2 className="text-blue-400 text-lg font-semibold mb-4">What We Retain:</h2>
              <ul className="space-y-2 text-slate-300">
                <li>• Transaction records (for legal compliance)</li>
                <li>• Aggregated analytics data</li>
              </ul>
              <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                Note: Account deletion requests are processed immediately, but residual data may remain in backups for up to 30 days as part of our security protocols.
              </p>
            </div>
          </>
        )}

        {/* Form Steps */}
        <div className="mt-6">
          {currentStep === 'credentials' && renderCredentialsStep()}
          {currentStep === 'otp' && renderOtpStep()}
          {currentStep === 'confirm' && renderConfirmStep()}
          {currentStep === 'success' && renderSuccessStep()}
        </div>
      </div>
    </div>
  );
}
