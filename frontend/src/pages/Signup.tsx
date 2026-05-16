import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Mail, Lock, User as UserIcon } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { signup, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result: any = await signup(formData);
      if (result && result.status === 'pending_verification') {
        navigate('/verify', { state: { email: formData.email } });
      }
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-3xl leading-none">G</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Join GigFlow - Smart Leads Platform
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" onClick={clearError} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Sign in
            </Link>
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
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                minLength={8}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                placeholder="Password (min 8 characters)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors shadow-blue-500/30"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
