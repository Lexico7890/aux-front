import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useUserStore } from '@/store/useUserStore';

export function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const setUser = useUserStore((state) => state.setUser);

  const validatePhoneNumber = (phone: string): boolean => {
    // Basic phone number validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (phone: string): string => {
    // Format to E.164 format (add country code if needed)
    // Assuming US numbers, adjust country code as needed
    const cleaned = phone.replace(/\s/g, '');
    return `+1${cleaned}`; // Change +1 to your country code
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber) {
      setError('Phone number is required');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      setOtpSent(true);
      toast.success('OTP sent to your phone number!');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      setError(error.message || 'Failed to send OTP. Please try again.');
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      // Fetch user session data
      const { data: dataUser, error: errorDataUser } = await supabase.rpc('get_user_session_data');

      if (errorDataUser) {
        console.error('Error fetching user session data:', errorDataUser);
      } else if (dataUser) {
        console.log('User session data:', dataUser);
        setUser(dataUser);
      }

      toast.success('Successfully authenticated!');
      console.log('User authenticated:', data);

      // Redirect to dashboard or home page
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setError(error.message || 'Invalid OTP. Please try again.');
      toast.error('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      console.log("data from google auth:", data);

      // Fetch user session data
      const { data: dataUser, error: errorDataUser } = await supabase.rpc('get_user_session_data');

      if (errorDataUser) {
        console.error('Error fetching user session data:', errorDataUser);
      } else if (dataUser) {
        console.log('User session data:', dataUser);
        setUser(dataUser);
      }
    } catch (error: any) {
      console.error('Error with Google authentication:', error);
      toast.error('Failed to authenticate with Google');
      setError(error.message || 'Failed to authenticate with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg border">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {otpSent
            ? 'Enter the verification code sent to your phone'
            : 'Sign in to your account to continue'}
        </p>
      </div>

      {!otpSent ? (
        <>
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setError('');
                }}
                className={error ? 'border-destructive' : ''}
                disabled={loading}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Continue with Phone'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            {loading ? 'Authenticating...' : 'Continue with Google'}
          </Button>
        </>
      ) : (
        <form onSubmit={handleOtpVerification} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium">
              Verification Code
            </label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                setError('');
              }}
              className={error ? 'border-destructive' : ''}
              disabled={loading}
              maxLength={6}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setOtpSent(false);
              setOtp('');
              setError('');
            }}
            disabled={loading}
          >
            Back to phone number
          </Button>
        </form>
      )}
    </div>
  );
}
