import { useState, useEffect } from 'react';
import { Save, User, Bell, Lock, CreditCard, Smartphone, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Settings = () => {
  const { user, updateProfile, updatePassword, loading, error, clearError } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [successMsg, setSuccessMsg] = useState('');

  // Profile Form State
  const [profileData, setProfileData] = useState({ name: user?.name || '', bio: (user as any)?.bio || '' });

  // Password Form State
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

  // Notifications State
  const [notifications, setNotifications] = useState({ newLead: true, weeklyReport: true, productUpdates: false });

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, bio: (user as any).bio || '' });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMsg('');
    try {
      await updateProfile(profileData);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      // Error in store
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMsg('');
    try {
      await updatePassword(passwordData);
      setSuccessMsg('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '' });
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      // Error in store
    }
  };

  const handleNotificationsSave = () => {
    setSuccessMsg('Notification preferences saved!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleBillingManage = () => {
    setSuccessMsg('Redirecting to Stripe Billing Portal...');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Account Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          Manage your GigFlow preferences and security.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 flex-shrink-0">
          <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto pb-4 md:pb-0">
            {[
              { id: 'profile', icon: User, label: 'Public Profile' },
              { id: 'security', icon: Lock, label: 'Security' },
              { id: 'notifications', icon: Bell, label: 'Notifications' },
              { id: 'billing', icon: CreditCard, label: 'Billing & Plan' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-semibold shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 transition-colors relative">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm flex items-center animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {successMsg}
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Public Profile</h3>
              
              <div className="flex items-center space-x-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-3xl shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <button type="button" className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors mb-2">
                    Change Avatar
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <input type="text" required value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-900 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                  <input type="email" disabled defaultValue={user?.email} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 cursor-not-allowed" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                  <textarea rows={3} placeholder="Write a short bio..." value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-900 dark:text-white"></textarea>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <button type="submit" disabled={loading} className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-medium rounded-xl transition-all shadow-sm shadow-blue-500/30">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Security</h3>
              <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="password" required placeholder="Current Password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-900 dark:text-white" />
                  <input type="password" required minLength={8} placeholder="New Password (min 8 char)" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-900 dark:text-white" />
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={loading} className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-70">
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-5 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <button type="button" className="px-4 py-2 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Email Notifications</h3>
              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-100 dark:border-gray-700 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <input type="checkbox" checked={notifications.newLead} onChange={(e) => setNotifications({...notifications, newLead: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-3 font-medium text-gray-700 dark:text-gray-300">New Lead Assigned</span>
                </label>
                <label className="flex items-center p-4 border border-gray-100 dark:border-gray-700 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <input type="checkbox" checked={notifications.weeklyReport} onChange={(e) => setNotifications({...notifications, weeklyReport: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-3 font-medium text-gray-700 dark:text-gray-300">Weekly Performance Report</span>
                </label>
                <label className="flex items-center p-4 border border-gray-100 dark:border-gray-700 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <input type="checkbox" checked={notifications.productUpdates} onChange={(e) => setNotifications({...notifications, productUpdates: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-3 font-medium text-gray-700 dark:text-gray-300">Product Updates & News</span>
                </label>
              </div>
              <div className="pt-4 flex justify-end">
                <button onClick={handleNotificationsSave} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-sm">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Plan</h3>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <CreditCard className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="uppercase tracking-wider text-sm font-semibold text-blue-200 mb-1">Current Plan</div>
                  <h4 className="text-4xl font-bold mb-4">Pro Tier</h4>
                  <p className="text-blue-100 mb-6 max-w-md">You have unlimited access to all GigFlow tools, including bulk imports and advanced filtering.</p>
                  <button onClick={handleBillingManage} className="px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                    Manage Subscription
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
