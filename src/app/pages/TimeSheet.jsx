"use client"
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MoreHorizontal, Plus, Edit, Trash2, Copy } from 'lucide-react';
import DynamicModal from '../component/DynamicModal.jsx';
import Table from '../component/table/Table.jsx';
import { FORM_TYPES } from '../config/formConfig.js';
import { addTimesheet, updateTimesheet, deleteTimesheet } from '../store/timeSlice.js';

const TimeSheet = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { timesheets, loading, error } = useSelector(state => state.timesheet);
  console.log(timesheets)
  
  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  
  // Filter states
  const [partyFilter, setPartyFilter] = useState('Party');
  const [dateFilter, setDateFilter] = useState('Date Filter');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Visible columns state for Table component
  const [visibleColumns, setVisibleColumns] = useState(['date', 'party', 'time', 'duration', 'project']);

  // Modal handlers
  const openModal = (formType) => {
    setActiveModal(formType);
    setIsOpen(true);
  };

  const closeModal = () => {
    setActiveModal(null);
    setIsOpen(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    const [hours, minutes] = timeString.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Define table columns
  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (value, item) => (
        <div className="text-sm text-gray-900">
          {formatDate(item.date)}
        </div>
      )
    },
    {
      key: 'party',
      label: 'Party',
      render: (value, item) => (
        <div className="text-sm text-gray-900">
          {item.partyName || 'Unknown Party'}
        </div>
      )
    },
    {
      key: 'time',
      label: 'Start & End Time',
      render: (value, item) => (
        <div className="text-sm text-gray-900">
          {formatTime(item.start)} - {formatTime(item.stop)}
        </div>
      )
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (value, item) => (
        <div className="text-sm text-gray-900">
          {item.duration || 'No duration'}
        </div>
      )
    },
    {
      key: 'project',
      label: 'Project',
      render: (value, item) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {item.projectName ? item.projectName.charAt(0).toUpperCase() : 'P'}
            </span>
          </div>
          {item.projectName && (
            <span className="ml-2 text-sm text-gray-600">
              {item.projectName}
            </span>
          )}
        </div>
      )
    }
  ];

  // Handle column toggle
  const handleColumnToggle = (columnKey) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.filter(key => key !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  // Filter timesheets based on search term and filters
  const filteredTimesheets = timesheets.filter(timesheet => {
    const matchesSearch = timesheet.partyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         timesheet.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         timesheet.remarks?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesParty = partyFilter === 'Party' || timesheet.partyName === partyFilter;
    
    // Date filter logic can be added here
    const matchesDate = dateFilter === 'Date Filter' || true; // Implement date filtering as needed
    
    return matchesSearch && matchesParty && matchesDate;
  });

  // Get unique parties for filter dropdown
  const uniqueParties = ['Party', ...new Set(timesheets.map(ts => ts.partyName).filter(Boolean))];

  // Action handlers
  const handleEditTimesheet = (timesheet) => {
    console.log('Edit timesheet:', timesheet);
    // You can implement edit functionality here by passing data to modal
    openModal(FORM_TYPES.TIMESHEET);
  };

  const handleDuplicateTimesheet = (timesheet) => {
    const duplicatedTimesheet = {
      ...timesheet,
      id: undefined, // Remove ID so new one will be generated
      remarks: `${timesheet.remarks || 'Duplicated'} (Copy)`,
      createdAt: new Date().toISOString()
    };
    dispatch(addTimesheet(duplicatedTimesheet));
  };

  const handleDeleteTimesheet = (timesheet) => {
    if (window.confirm(`Are you sure you want to delete this timesheet entry for ${timesheet.partyName}?`)) {
      dispatch(deleteTimesheet(timesheet.id));
    }
  };

  // Calculate total hours
  const totalHours = filteredTimesheets.reduce((total, ts) => {
    if (ts.duration) {
      const hours = parseInt(ts.duration.replace(/[^\d]/g, '')) || 0;
      return total + hours;
    }
    return total;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Party Filter */}
                <div className="relative">
                  <select
                    value={partyFilter}
                    onChange={(e) => setPartyFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {uniqueParties.map(party => (
                      <option key={party} value={party}>{party}</option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Date Filter */}
                <div className="relative">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Date Filter">Date Filter</option>
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                    <option value="Custom Range">Custom Range</option>
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Search Box */}
              <div className="relative max-w-md left-2">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div></div>

          <div className="flex items-center space-x-4">
            {/* Premium Plan Badge */}
            {/* Action Buttons */}
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Get Loan
            </button>
            <button className="text-green-600 hover:text-green-700 font-medium">
              Refer & Earn
            </button>
            {/* New Timesheet Button */}
            <button
              onClick={() => openModal(FORM_TYPES.TIMESHEET)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus size={16} />
              New Timesheet
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading timesheets...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Error: {error}</p>
          </div>
        </div>
      )}

      {/* Table Section */}
      {!loading && !error && (
        <div className="p-6">
          {/* Table Component */}
          <Table
            data={filteredTimesheets}
            columns={columns}
            visibleColumns={visibleColumns}
            onColumnToggle={handleColumnToggle}
            onPinProject={handleDuplicateTimesheet} // Using duplicate functionality for pin
            onDuplicateProject={handleDuplicateTimesheet}
            pinnedProjects={[]} // No pinned functionality for timesheets
            onEditProject={handleEditTimesheet}
            emptyMessage="No timesheets found. Click 'New Timesheet' to get started."
          />

          {/* Summary Card */}
          {filteredTimesheets.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredTimesheets.length}
                  </div>
                  <div className="text-sm text-gray-500">Total Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {totalHours}
                  </div>
                  <div className="text-sm text-gray-500">Total Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(filteredTimesheets.map(ts => ts.partyName).filter(Boolean)).size}
                  </div>
                  <div className="text-sm text-gray-500">Unique Parties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {new Set(filteredTimesheets.map(ts => ts.projectName).filter(Boolean)).size}
                  </div>
                  <div className="text-sm text-gray-500">Projects</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveDropdown(null)}
        />
      )}

      {/* Dynamic Modal */}
      {activeModal && (
        <DynamicModal
          formType={activeModal}
          isOpen={isOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default TimeSheet;