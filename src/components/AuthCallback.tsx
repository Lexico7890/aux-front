// src/components/AuthCallback.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/useUserStore';

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setSessionData = useUserStore((state) => state.setSessionData);

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (!user) {
        throw new Error('No user found');
      }

      const { data: sessionData, error: rpcError } = await supabase.rpc('get_user_session_data');

      if (rpcError) {
        console.error('RPC error:', rpcError);
        throw rpcError;
      }

      if (!sessionData) {
        throw new Error('No session data returned');
      }
      setSessionData(sessionData);
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

    } catch (error: any) {
      console.error('❌ Error in callback:', error);
      setError(error.message || 'Authentication failed');
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ Error</div>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          {loading ? 'Cargando su sesion...' : 'Redirigiendo a la pagina principal...'}
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;