"use client"
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus } from 'lucide-react';
import Table from '../component/table/Table.jsx';
import DynamicModal from '../component/DynamicModal.jsx';
import { FORM_TYPES } from '../config/formConfig.js';
// import { addMom, updateMom, deleteMom } from '../store/momSlice.js';

const Mom = () => {
  const dispatch = useDispatch();
  
  // Redux state (uncomment when slice is ready)
  // const { moms, loading, error } = useSelector(state => state.moms);
  
  // Mock data for now
  const moms = [
    {
      id: 1,
      name: 'category',
      date: '15 Aug 2025',
      attendee: 1,
      project: 'sagarguptagupta',
      notes: '--'
    }
  ];

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  
  // Filter states
  const [attendeeFilter, setAttendeeFilter] = useState('Attendee');
  const [projectFilter, setProjectFilter] = useState('Project');
  const [searchTerm, setSearchTerm] = useState('');

  // Visible columns state for Table component
  const [visibleColumns, setVisibleColumns] = useState(['name', 'attendee', 'project', 'notes']);

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
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value, item) => (
        <div>
          <div className="font-medium text-gray-900">{value || 'Untitled'}</div>
          <div className="text-sm text-gray-500">{formatDate(item.date)}</div>
        </div>
      )
    },
    {
      key: 'attendee',
      label: 'Attendee',
      render: (value) => (
        <div className="text-sm text-gray-900">
          {value || '--'}
        </div>
      )
    },
    {
      key: 'project',
      label: 'Project',
      render: (value) => (
        <div className="text-sm text-gray-900">
          {value || '--'}
        </div>
      )
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (value) => (
        <div className="text-sm text-gray-900">
          {value || '--'}
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

  // Get unique attendees and projects for filter dropdowns
  const uniqueAttendees = ['Attendee', ...new Set(moms.map(mom => mom.attendee).filter(Boolean))];
  const uniqueProjects = ['Project', ...new Set(moms.map(mom => mom.project).filter(Boolean))];

  // Filter moms based on search term and filters
  const filteredMoms = moms.filter(mom => {
    const matchesSearch = mom.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mom.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mom.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAttendee = attendeeFilter === 'Attendee' || mom.attendee === attendeeFilter;
    const matchesProject = projectFilter === 'Project' || mom.project === projectFilter;
    
    return matchesSearch && matchesAttendee && matchesProject;
  });

  // Action handlers
  const handleEditMom = (mom) => {
    console.log('Edit MOM:', mom);
    // Pass mom data to modal for editing
    openModal(FORM_TYPES.MOM);
  };

  const handleDuplicateMom = (mom) => {
    const duplicatedMom = {
      ...mom,
      id: undefined, // Remove ID so new one will be generated
      name: `${mom.name} (Copy)`,
      createdAt: new Date().toISOString()
    };
    // dispatch(addMom(duplicatedMom));
    console.log('Duplicate MOM:', duplicatedMom);
  };

  const handlePinMom = (momId) => {
    // Pin functionality can be added here
    console.log('Pin MOM:', momId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            
            {/* Search Box */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
              />
            </div>

            {/* Date Filter */}
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              Date Filter
            </button>

            {/* Attendee Filter */}
            <div className="relative">
              <select
                value={attendeeFilter}
                onChange={(e) => setAttendeeFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {uniqueAttendees.map(attendee => (
                  <option key={attendee} value={attendee}>{attendee}</option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Project Filter */}
            <div className="relative">
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {uniqueProjects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
        
            
            {/* New MOM Button */}
            <button
              onClick={() => openModal(FORM_TYPES.MOM)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus size={16} />
              New MOM 
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="p-6">
        {/* Table Component */}
        <Table
          data={filteredMoms}
          columns={columns}
          visibleColumns={visibleColumns}
          onColumnToggle={handleColumnToggle}
          onPinProject={handlePinMom}
          onDuplicateProject={handleDuplicateMom}
          onEditProject={handleEditMom}
          pinnedProjects={[]} // No pinned functionality for MOMs
          emptyMessage="No MOMs found. Click 'New MOM +' to get started."
        />
      </div>

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

export default Mom;