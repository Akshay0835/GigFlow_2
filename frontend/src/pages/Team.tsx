import { useState } from 'react';
import { UserPlus, Mail, Shield, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Team = () => {
  const [isInviting, setIsInviting] = useState(false);
  const [invited, setInvited] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Sales');
  const { inviteMember, error } = useAuthStore();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      await inviteMember(email, role);
      setIsInviting(false);
      setInvited(true);
      setTimeout(() => {
        setInvited(false);
        setEmail('');
      }, 3000);
    } catch (err) {
      setIsInviting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Team Directory</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Manage your organization's members and roles.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Active Team Members</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">You currently have 1 active member (Admin).</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-fit">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Invite New Member</h3>
          {invited ? (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-400">Invitation Sent!</h4>
              <p className="text-sm text-emerald-600 dark:text-emerald-300 mt-1">They will receive an email shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleInvite} className="space-y-5">
              {error && (
                <div className="p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    type="email" 
                    required
                    placeholder="colleague@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
                  >
                    <option value="Sales">Sales Representative</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isInviting}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-medium rounded-xl transition-all shadow-sm shadow-blue-500/30"
              >
                {isInviting ? 'Sending...' : 'Send Invitation'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;
