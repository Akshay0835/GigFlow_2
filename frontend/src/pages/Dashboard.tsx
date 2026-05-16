import { Download, Search, Upload, Plus, Edit2, Trash2, Eye, X, ChevronDown, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomDropdown = ({ value, onChange, options, placeholder, iconColorClass }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt: any) => opt.value === value);

  return (
    <div className="relative w-full sm:w-48" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between pl-4 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full bg-white dark:bg-gray-900/50 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-semibold shadow-sm hover:shadow-md transition-all group"
      >
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-3 ${iconColorClass}`}></div>
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option: any) => (
              <button
                key={option.value}
                type="button"
                className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  value === option.value 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
                {value === option.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import { useEffect, useState, useRef } from 'react';
import useLeadStore from '../store/useLeadStore';
import useAuthStore from '../store/useAuthStore';

const Dashboard = () => {
  const { leads, loading, fetchLeads, createLead, updateLead, deleteLead, total } = useLeadStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('-createdAt');
  const [page, setPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', status: 'New', source: 'Website' });

  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({ message: '', type: 'success', visible: false });
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  // Custom Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openModal = (mode: 'create' | 'edit' | 'view', lead: any = null) => {
    setModalMode(mode);
    setSelectedLead(lead);
    if (lead && mode !== 'create') {
      setFormData({ name: lead.name, email: lead.email, status: lead.status, source: lead.source });
    } else {
      setFormData({ name: '', email: '', status: 'New', source: 'Website' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await createLead(formData);
        showToast('Lead created successfully!', 'success');
      } else if (modalMode === 'edit' && selectedLead) {
        await updateLead(selectedLead._id, formData);
        showToast('Lead updated successfully!', 'success');
      }
      closeModal();
    } catch (err: any) {
      showToast('Error saving lead: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteLead(deleteConfirmId);
      showToast('Lead deleted successfully!', 'success');
    } catch (err: any) {
      showToast('Error deleting lead: ' + (err.response?.data?.message || err.message), 'error');
    }
    setDeleteConfirmId(null);
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, sourceFilter, sortOrder]);

  // Debounce implementation
  useEffect(() => {
    const handler = setTimeout(() => {
      const params: any = { page, limit: 10 };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (sourceFilter) params.source = sourceFilter;
      if (sortOrder) params.sort = sortOrder;
      fetchLeads(params);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, statusFilter, sourceFilter, sortOrder, page, fetchLeads]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter((row) => row.trim() !== '');
      const parseCSVRow = (row: string) => {
        const values = [];
        let insideQuotes = false;
        let currentValue = '';
        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.trim());
        return values;
      };

      const headers = parseCSVRow(rows[0]).map((h) => h.toLowerCase());
      
      const newLeads = rows.slice(1).map((row) => {
        const values = parseCSVRow(row);
        const lead: any = {};
        headers.forEach((header, index) => {
          if (header === 'name' || header === 'email' || header === 'status' || header === 'source') {
            lead[header] = values[index];
          }
        });
        return lead;
      });

      useLeadStore.getState().importLeads(newLeads)
        .then(() => {
          showToast('Leads imported successfully!', 'success');
        })
        .catch((err) => {
          showToast('Error importing leads: ' + (err.response?.data?.message || err.message), 'error');
        });
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExportCSV = () => {
    if (!leads || leads.length === 0) return;

    // Define CSV headers
    const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
    
    // Convert leads to CSV rows
    const csvRows = leads.map(lead => {
      return [
        `"${lead.name || ''}"`,
        `"${lead.email || ''}"`,
        `"${lead.status || ''}"`,
        `"${lead.source || ''}"`,
        `"${new Date(lead.createdAt).toLocaleDateString()}"`
      ].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 transition-colors">Lead Management</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">
            Track, filter, and convert your pipeline effectively.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
          {isAdmin && (
            <>
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-5 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-all border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </button>
              <button 
                onClick={handleExportCSV}
                className="flex items-center px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-all border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </>
          )}
          <button 
            onClick={() => openModal('create')}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-5 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm flex flex-col lg:flex-row gap-5 items-center justify-between transition-colors relative z-20">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-50/50 via-transparent to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 pointer-events-none" />
        
        {/* Search Bar */}
        <div className="relative w-full lg:max-w-md z-10 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto z-10">
          
          <CustomDropdown 
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
            iconColorClass="bg-indigo-500"
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'New', label: 'New' },
              { value: 'Contacted', label: 'Contacted' },
              { value: 'Qualified', label: 'Qualified' },
              { value: 'Lost', label: 'Lost' },
            ]}
          />
          
          <CustomDropdown 
            value={sourceFilter}
            onChange={setSourceFilter}
            placeholder="All Sources"
            iconColorClass="bg-blue-500"
            options={[
              { value: '', label: 'All Sources' },
              { value: 'Website', label: 'Website' },
              { value: 'Referral', label: 'Referral' },
              { value: 'Cold Call', label: 'Cold Call' },
              { value: 'Instagram', label: 'Instagram' },
            ]}
          />
          
          <CustomDropdown 
            value={sortOrder}
            onChange={setSortOrder}
            placeholder="Sort by"
            iconColorClass="bg-purple-500"
            options={[
              { value: '-createdAt', label: 'Latest First' },
              { value: 'createdAt', label: 'Oldest First' },
            ]}
          />

        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all hover:shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead Details</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => openModal('view', lead)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openModal('edit', lead)} className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Edit Lead">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button onClick={() => setDeleteConfirmId(lead._id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Delete Lead">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{(page - 1) * 10 + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(page * 10, total)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{total}</span> entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              title="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(Math.ceil(total / 10), p + 1))}
              disabled={page >= Math.ceil(total / 10)}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              title="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Modal for Create/Edit/View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {modalMode === 'create' ? 'Add New Lead' : modalMode === 'edit' ? 'Edit Lead' : 'Lead Details'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveLead} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    disabled={modalMode === 'view'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    disabled={modalMode === 'view'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select
                      disabled={modalMode === 'view'}
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Source</label>
                    <select
                      disabled={modalMode === 'view'}
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <option value="Website">Website</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Referral">Referral</option>
                      <option value="Cold Call">Cold Call</option>
                    </select>
                  </div>
                </div>
                {modalMode === 'view' && selectedLead && (
                  <div className="pt-2 text-sm text-gray-500 dark:text-gray-400">
                    <p><strong>Created At:</strong> {new Date(selectedLead.createdAt).toLocaleString()}</p>
                    <p><strong>ID:</strong> {selectedLead._id}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {modalMode !== 'view' && (
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
                  >
                    {modalMode === 'create' ? 'Create Lead' : 'Save Changes'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500 mx-auto flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Lead?</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors w-full"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-sm w-full"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notification */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center px-6 py-4 rounded-xl shadow-lg border ${
          toast.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' 
            : 'bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
        }`}>
          <div className="mr-3 font-semibold text-sm">
            {toast.message}
          </div>
          <button onClick={() => setToast(prev => ({ ...prev, visible: false }))} className="text-current opacity-70 hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
