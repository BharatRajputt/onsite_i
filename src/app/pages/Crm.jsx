"use client"
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ChevronDown, Plus, Filter, Calendar, ChevronLeft, ChevronRight, MoreHorizontal, Edit, Trash2, Copy, Eye } from 'lucide-react';
import Table from '../component/table/Table';
import DynamicModal from '../component/DynamicModal';
import { 
  addLead, 
  updateLead, 
  deleteLead, 
  duplicateLead, 
  setEditLead, 
  cancelEdit,
  updateFilters,
  clearFilters,
  updateSorting,
  selectAllLeads,
  selectCurrentLead,
  selectIsEditMode,
  selectFilteredLeads,
  selectLeadStats,
  selectFilters
} from '../store/leadSlice';
import { FORM_TYPES } from '../config/formConfig';

const Crm = () => {
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  
  // Redux state
  const leads = useSelector(selectAllLeads);
  console.log(leads)
  const currentLead = useSelector(selectCurrentLead);
  const isEditMode = useSelector(selectIsEditMode);
  const leadStats = useSelector(selectLeadStats);
  const filters = useSelector(selectFilters);
  
  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Leads');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showActions, setShowActions] = useState({});

  // Enhanced table columns with actions
const columns = [
  {
    key: 'select',
    label: '',
    width: '50px',
    render: (value, row) => {
      // Add null check
      if (!row || !row.id) return null;
      
      return (
        <input
          type="checkbox"
          checked={selectedLeads.includes(row.id)}
          onChange={(e) => handleSelectLead(row.id, e.target.checked)}
          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
      );
    }
  },
  {
    key: 'sno',
    label: 'S.No.',
    width: '70px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="text-gray-900 font-medium">{row.sno || '--'}</div>
      );
    }
  },
  {
    key: 'leadType',
    label: 'Lead Type',
    width: '120px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="text-gray-900 truncate">{row.leadType || '--'}</div>
      );
    }
  },
  {
    key: 'contactName',
    label: 'Contact Name',
    width: '150px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="text-gray-900 font-medium truncate">{row.contactName || '--'}</div>
      );
    }
  },
  {
    key: 'contactNumber',
    label: 'Contact Number',
    width: '140px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="text-gray-900">{row.contactNumber || '--'}</div>
      );
    }
  },
  {
    key: 'email',
    label: 'Email',
    width: '180px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="text-gray-900 truncate">{row.email || '--'}</div>
      );
    }
  },
  {
    key: 'companyName',
    label: 'Company Name',
    width: '150px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="text-gray-900 truncate">{row.companyName || '--'}</div>
      );
    }
  },
  {
    key: 'status',
    label: 'Status',
    width: '120px',
    render: (value, row) => {
      if (!row || !row.status) return null;
      return (
        <div className="inline-flex">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            row.status === 'New' ? 'bg-blue-100 text-blue-800' :
            row.status === 'Qualified' ? 'bg-green-100 text-green-800' :
            row.status === 'Proposal Sent' ? 'bg-yellow-100 text-yellow-800' :
            row.status === 'Closed Won' ? 'bg-green-100 text-green-800' :
            row.status === 'Closed Lost' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {row.status}
          </span>
        </div>
      );
    }
  },
  {
    key: 'address',
    label: 'Address',
    width: '160px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="text-gray-900 truncate" title={row.address}>
          {row.address || '--'}
        </div>
      );
    }
  },
  {
    key: 'creationDate',
    label: 'Creation Date',
    width: '130px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="text-gray-900">
          {row.creationDate ? new Date(row.creationDate).toLocaleDateString('en-IN') : '--'}
        </div>
      );
    }
  },
  {
    key: 'nextFollowUp',
    label: 'Next Follow Up',
    width: '140px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="text-gray-900">
          {row.nextFollowUp ? new Date(row.nextFollowUp).toLocaleDateString('en-IN') : '--'}
        </div>
      );
    }
  },
  {
    key: 'expectedClosure',
    label: 'Expected Closure',
    width: '150px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="text-gray-900">
          {row.expectedClosure ? new Date(row.expectedClosure).toLocaleDateString('en-IN') : '--'}
        </div>
      );
    }
  },
  {
    key: 'lastContacted',
    label: 'Last Contacted',
    width: '140px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="text-gray-900">
          {row.lastContacted ? new Date(row.lastContacted).toLocaleDateString('en-IN') : '--'}
        </div>
      );
    }
  },
  {
    key: 'source',
    label: 'Source',
    width: '120px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="text-gray-900">{row.source || '--'}</div>
      );
    }
  },
  {
    key: 'category',
    label: 'Category',
    width: '120px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="text-gray-900">{row.category || '--'}</div>
      );
    }
  },
  {
    key: 'priority',
    label: 'Priority',
    width: '100px',
    render: (value, row) => {
      if (!row || !row.priority) return null;
      return (
        <div className="inline-flex">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            row.priority === 'High' ? 'bg-red-100 text-red-800' :
            row.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {row.priority}
          </span>
        </div>
      );
    }
  },
  {
    key: 'budget',
    label: 'Budget',
    width: '120px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="text-gray-900 font-medium">
          {row.budget ? `₹${parseInt(row.budget).toLocaleString()}` : '--'}
        </div>
      );
    }
  },
  {
    key: 'leadAssignee',
    label: 'Lead Assignee',
    width: '140px',
    render: (value, row) => {
      if (!row) return null;
      return (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
            {row.assigneeAvatar || '?'}
          </div>
          <span className="text-gray-900 truncate">{row.leadAssignee || '--'}</span>
        </div>
      );
    }
  },
  {
    key: 'actions',
    label: 'Actions',
    width: '100px',
    render: (value, row) => {
      // Critical: Add null check for actions
      if (!row || !row.id) return null;
      
      return (
        <div className="relative">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => toggleActions(row.id)}
          >
            <MoreHorizontal size={16} className="text-gray-400" />
          </button>
          
          {showActions[row.id] && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
              <button
                onClick={() => handleView(row)}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-gray-50"
              >
                <Eye size={14} />
                <span>View</span>
              </button>
              <button
                onClick={() => handleEdit(row)}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-gray-50"
              >
                <Edit size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDuplicate(row.id)}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-gray-50"
              >
                <Copy size={14} />
                <span>Duplicate</span>
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-red-600"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      );
    }
  }
];

// Updated visibleColumns array (removed duplicates and ordered properly)
const visibleColumns = [
  'select', 
  'sno', 
  'leadType', 
  'contactName', 
  'contactNumber', 
  'email', 
  'companyName', 
  'status', 
  'address', 
  'creationDate', 
  'nextFollowUp', 
  'expectedClosure', 
  'lastContacted', 
  'source', 
  'category', 
  'priority', 
  'budget', 
  'leadAssignee', 
  'actions'
];

  // Event handlers
  const handleCreateLead = () => {
    if (isEditMode) {
      dispatch(cancelEdit());
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (isEditMode) {
      dispatch(cancelEdit());
    }
  };

  const handleEdit = (lead) => {
    dispatch(setEditLead(lead.id));
    setIsModalOpen(true);
    setShowActions({});
  };

  const handleView = (lead) => {
    console.log('View lead:', lead);
    setShowActions({});
  };

  const handleDelete = (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      dispatch(deleteLead(leadId));
    }
    setShowActions({});
  };

  const handleDuplicate = (leadId) => {
    dispatch(duplicateLead(leadId));
    setShowActions({});
  };

  const handleSelectLead = (leadId, checked) => {
    if (checked) {
      setSelectedLeads([...selectedLeads, leadId]);
    } else {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedLeads.length > 0 && window.confirm(`Delete ${selectedLeads.length} leads?`)) {
      selectedLeads.forEach(id => dispatch(deleteLead(id)));
      setSelectedLeads([]);
    }
  };

  const toggleActions = (leadId) => {
    setShowActions(prev => ({
      ...prev,
      [leadId]: !prev[leadId]
    }));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(updateFilters({ [filterType]: value }));
  };

  const handleSearch = (searchTerm) => {
    dispatch(updateFilters({ search: searchTerm }));
  };

  // Table scroll functions - targeting the specific table container
  const scrollTableLeft = () => {
    const tableContainer = document.querySelector('.table-scroll-container');
    if (tableContainer) {
      tableContainer.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollTableRight = () => {
    const tableContainer = document.querySelector('.table-scroll-container');
    if (tableContainer) {
      tableContainer.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen  flex flex-col bg-gray-50 overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            
            {/* Tabs - Horizontally Scrollable */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-8 min-w-max">
                <button 
                  className={`pb-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                    selectedTab === 'Leads' 
                      ? 'text-purple-600 border-purple-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                  onClick={() => setSelectedTab('Leads')}
                >
                  Leads ({leadStats.total})
                </button>
                <button 
                  className={`pb-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                    selectedTab === 'Quotation' 
                      ? 'text-purple-600 border-purple-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                  onClick={() => setSelectedTab('Quotation')}
                >
                  Quotation
                </button>
                <button 
                  className={`pb-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                    selectedTab === 'Opportunities' 
                      ? 'text-purple-600 border-purple-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                  onClick={() => setSelectedTab('Opportunities')}
                >
                  Opportunities
                </button>
                <button 
                  className={`pb-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                    selectedTab === 'Contacts' 
                      ? 'text-purple-600 border-purple-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                  onClick={() => setSelectedTab('Contacts')}
                >
                  Contacts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Stats Cards - Horizontally Scrollable */}
          <div className="mb-6">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 min-w-max pb-2">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 min-w-[180px]">
                  <div className="text-2xl font-bold text-purple-600">{leadStats.total}</div>
                  <div className="text-sm text-gray-600">Total Leads</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 min-w-[180px]">
                  <div className="text-2xl font-bold text-blue-600">{leadStats.new}</div>
                  <div className="text-sm text-gray-600">New Leads</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 min-w-[180px]">
                  <div className="text-2xl font-bold text-green-600">{leadStats.qualified}</div>
                  <div className="text-sm text-gray-600">Qualified</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 min-w-[180px]">
                  <div className="text-2xl font-bold text-orange-600">{leadStats.converted}</div>
                  <div className="text-sm text-gray-600">Converted</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 min-w-[180px]">
                  <div className="text-2xl font-bold text-green-600">₹{leadStats.totalBudget.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Budget</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left side filters */}
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex items-center space-x-4 min-w-max">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search leads..."
                      value={filters.search}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                    />
                  </div>

                  {/* Assignee Filter */}
                  <select
                    value={filters.assignee}
                    onChange={(e) => handleFilterChange('assignee', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Assignees</option>
                    <option value="Sagar">Sagar</option>
                    <option value="Priya">Priya</option>
                    <option value="Amit">Amit</option>
                    <option value="Rahul">Rahul</option>
                    <option value="Anita">Anita</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </select>

                  {/* Priority Filter */}
                  <select
                    value={filters.priority}
                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>

                  {/* Clear Filters */}
                  {(filters.search || filters.assignee || filters.status || filters.priority) && (
                    <button
                      onClick={() => dispatch(clearFilters())}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                {/* Bulk Actions */}
                {selectedLeads.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{selectedLeads.length} selected</span>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {/* Table Scroll Controls */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={scrollTableLeft}
                    className="p-2 hover:bg-white rounded-md transition-colors"
                    title="Scroll Table Left"
                  >
                    <ChevronLeft size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={scrollTableRight}
                    className="p-2 hover:bg-white rounded-md transition-colors"
                    title="Scroll Table Right"
                  >
                    <ChevronRight size={16} className="text-gray-600" />
                  </button>
                </div>

                {/* New Lead Button */}
                <button
                  onClick={handleCreateLead}
                  className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap"
                >
                  <Plus size={16} />
                  <span>{isEditMode ? 'Cancel Edit' : 'New Lead'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table Container - Fixed Height with Internal Scrolling */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="h-[60vh] overflow-hidden">
              <div 
                className="h-full overflow-x-auto overflow-y-auto table-scroll-container"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#D1D5DB #F3F4F6'
                }}
              >
                <div className="min-w-max h-full">
                  <Table
                    columns={columns}
                    data={leads}
                    visibleColumns={visibleColumns}
                    emptyMessage="No leads found"
                    onColumnToggle={() => {}}
                    onPinProject={() => {}}
                    onEditProject={() => {}}
                    onDuplicateProject={() => {}}
                    pinnedProjects={[]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {leads.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus size={24} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Leads Found</h3>
                <p className="text-gray-600 mb-4">
                  {filters.search || filters.assignee || filters.status || filters.priority 
                    ? 'No leads match your current filters. Try adjusting your search criteria.'
                    : 'Get started by creating your first lead.'
                  }
                </p>
                {!(filters.search || filters.assignee || filters.status || filters.priority) && (
                  <button
                    onClick={handleCreateLead}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create First Lead
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Modal for New/Edit Lead */}
      <DynamicModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formType={FORM_TYPES.LEAD}
        initialData={isEditMode ? currentLead : null}
      />

      {/* Custom CSS for hiding scrollbars while maintaining functionality */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Crm;