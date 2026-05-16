import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { KeyRound } from 'lucide-react';

const Verify = () => {
  const [code, setCode] = useState('');
  const { verifyEmail, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyEmail(email, code);
      navigate('/');
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                required
                maxLength={6}
                className="w-full text-center tracking-[1em] font-mono text-2xl py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                placeholder="------"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 transition-colors shadow-emerald-500/30"
          >
            {loading ? 'Verifying...' : 'Complete Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
