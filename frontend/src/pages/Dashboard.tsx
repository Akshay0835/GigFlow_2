import { useEffect, useState, useRef } from 'react';
import useLeadStore from '../store/useLeadStore';
import { Download, Search, Filter, Upload } from 'lucide-react';

const Dashboard = () => {
  const { leads, loading, fetchLeads } = useLeadStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  // Debounce implementation
  useEffect(() => {
    const handler = setTimeout(() => {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (sourceFilter) params.source = sourceFilter;
      fetchLeads(params);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, statusFilter, sourceFilter, fetchLeads]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter((row) => row.trim() !== '');
      const headers = rows[0].split(',').map((h) => h.trim().toLowerCase());
      
      const newLeads = rows.slice(1).map((row) => {
        const values = row.split(',').map((v) => v.trim());
        const lead: any = {};
        headers.forEach((header, index) => {
          if (header === 'name' || header === 'email' || header === 'status' || header === 'source') {
            lead[header] = values[index];
          }
        });
        return lead;
      });

      useLeadStore.getState().importLeads(newLeads);
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Lead Management</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-lg">
            Track, filter, and convert your pipeline effectively.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </button>
          <button className="flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm shadow-blue-500/30">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between transition-colors">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none font-medium cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none font-medium cursor-pointer"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Instagram">Instagram</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                      <p>Loading leads...</p>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-lg font-medium text-gray-900 dark:text-white">No leads found</p>
                      <p className="mt-1">Try adjusting your search filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mr-4">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{lead.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
                      {lead.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
