"use client"
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MoreHorizontal, Plus, Edit, Trash2, Copy } from 'lucide-react';
import DynamicModal from '../component/DynamicModal.jsx';
import Table from '../component/table/Table.jsx';
import { FORM_TYPES } from '../config/formConfig.js';
import { addTimesheet, updateTimesheet, deleteTimesheet } from '../store/timeSlice.js';
import { useGetAllTimesheetsQuery } from '../store/api'

const TimeSheet = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { timesheets, loading, error } = useSelector(state => state.timesheet);
  console.log(timesheets)
  
  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  
  // RTK Query for fetching timesheets
  const { data: timeSheetData, isLoading: apiLoading, error: apiError } = useGetAllTimesheetsQuery();
  console.log('Timesheet data from API:', timeSheetData);
  
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
    
    // Handle different time formats
    if (timeString.includes('T')) {
      // ISO format
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      // HH:MM format
      const [hours, minutes] = timeString.split(':');
      const hour12 = hours % 12 || 12;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${ampm}`;
    }
  };

  // Format duration for display
  const formatDuration = (duration) => {
    if (!duration) return 'No duration';
    
    if (typeof duration === 'object') {
      // Duration object format: { hours: 1, minutes: 30 }
      const { hours = 0, minutes = 0 } = duration;
      return `${hours}h ${minutes}m`;
    } else if (typeof duration === 'string') {
      // String format already formatted
      return duration;
    }
    
    return 'Invalid duration';
  };

  // Define table columns with better data mapping
  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (value, item) => (
        <div className="text-sm text-gray-900">
          {formatDate(item.workDate || item.date)}
        </div>
      )
    },
    {
      key: 'party',
      label: 'Party',
      render: (value, item) => (
        <div className="text-sm text-gray-900">
          {item.partyId?.partyName || item.partyName || 'Unknown Party'}
        </div>
      )
    },
    {
      key: 'time',
      label: 'Start & End Time',
      render: (value, item) => (
        <div className="text-sm text-gray-900">
          {formatTime(item.startTime || item.start)} - {formatTime(item.endTime || item.stop)}
        </div>
      )
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (value, item) => (
        <div className="text-sm text-gray-900">
          {formatDuration(item.duration)}
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
              {(item.projectId?.projectName || item.projectName)?.charAt(0).toUpperCase() || 'P'}
            </span>
          </div>
          {(item.projectId?.projectName || item.projectName) && (
            <span className="ml-2 text-sm text-gray-600">
              {item.projectId?.projectName || item.projectName}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'task',
      label: 'Task',
      render: (value, item) => (
        <div className="text-sm text-gray-900">
          {item.taskId?.taskName || item.taskName || 'No task'}
        </div>
      )
    },
    {
      key: 'remarks',
      label: 'Remarks',
      render: (value, item) => (
        <div className="text-sm text-gray-500 max-w-xs truncate">
          {item.remarks || 'No remarks'}
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

  // Use API data if available, fallback to Redux data
  const timesheetData = timeSheetData?.data || timesheets || [];
  const isLoadingData = apiLoading || loading;
  const dataError = apiError || error;

  // Filter timesheets based on search term and filters
  const filteredTimesheets = timesheetData.filter(timesheet => {
    const partyName = timesheet.partyId?.partyName || timesheet.partyName || '';
    const projectName = timesheet.projectId?.projectName || timesheet.projectName || '';
    const taskName = timesheet.taskId?.taskName || timesheet.taskName || '';
    const remarks = timesheet.remarks || '';
    
    const matchesSearch = partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         remarks.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesParty = partyFilter === 'Party' || partyName === partyFilter;
    
    // Date filter logic can be enhanced
    const matchesDate = dateFilter === 'Date Filter' || true; // Implement date filtering as needed
    
    return matchesSearch && matchesParty && matchesDate;
  });

  // Get unique parties for filter dropdown
  const uniqueParties = ['Party', ...new Set(
    timesheetData
      .map(ts => ts.partyId?.partyName || ts.partyName)
      .filter(Boolean)
  )];

  // Action handlers
  const handleEditTimesheet = (timesheet) => {
    console.log('Edit timesheet:', timesheet);
    // You can implement edit functionality here by passing data to modal
    openModal(FORM_TYPES.TIMESHEET);
  };

  const handleDuplicateTimesheet = (timesheet) => {
    const duplicatedTimesheet = {
      ...timesheet,
      _id: undefined, // Remove ID so new one will be generated
      id: undefined,
      remarks: `${timesheet.remarks || 'Duplicated'} (Copy)`,
      createdAt: new Date().toISOString()
    };
    dispatch(addTimesheet(duplicatedTimesheet));
  };

  const handleDeleteTimesheet = (timesheet) => {
    const partyName = timesheet.partyId?.partyName || timesheet.partyName || 'this entry';
    if (window.confirm(`Are you sure you want to delete this timesheet entry for ${partyName}?`)) {
      dispatch(deleteTimesheet(timesheet._id || timesheet.id));
    }
  };

  // Calculate total hours
  const totalHours = filteredTimesheets.reduce((total, ts) => {
    if (ts.duration) {
      if (typeof ts.duration === 'object') {
        return total + (ts.duration.hours || 0) + (ts.duration.minutes || 0) / 60;
      } else if (typeof ts.duration === 'string') {
        const match = ts.duration.match(/(\d+)h\s*(\d+)m/);
        if (match) {
          const hours = parseInt(match[1]) || 0;
          const minutes = parseInt(match[2]) || 0;
          return total + hours + minutes / 60;
        }
      }
    }
    return total;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
          <div className="relative max-w-md">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search timesheets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-4">
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
      {isLoadingData && (
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading timesheets...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {dataError && (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">
              Error: {dataError?.data?.message || dataError?.message || 'Failed to load timesheets'}
            </p>
          </div>
        </div>
      )}

      {/* Table Section */}
      {!isLoadingData && !dataError && (
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
                    {Math.round(totalHours * 10) / 10}h
                  </div>
                  <div className="text-sm text-gray-500">Total Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(
                      filteredTimesheets
                        .map(ts => ts.partyId?.partyName || ts.partyName)
                        .filter(Boolean)
                    ).size}
                  </div>
                  <div className="text-sm text-gray-500">Unique Parties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {new Set(
                      filteredTimesheets
                        .map(ts => ts.projectId?.projectName || ts.projectName)
                        .filter(Boolean)
                    ).size}
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
          formType={FORM_TYPES.TIMESHEET}
          isOpen={isOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default TimeSheet;