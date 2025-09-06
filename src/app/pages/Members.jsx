"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveItem } from '../store/sidebarSlice.js';
import { addParty,deleteParty } from '../store/partySlice.js';
import ReusableTable from '../component/table/Table.jsx';
import { Factory, Handshake, Landmark, Users } from 'lucide-react';
import DynamicModal from '../component/DynamicModal.jsx';
import { FORM_TYPES } from '../config/formConfig.js';
import {useGetMembersQuery } from '../store/api'
const Members = () => {
  const dispatch = useDispatch();
  const { parties, loading, erro } = useSelector((state) => state.party);
  const { data: party, error, isLoading: isLoadingg } = useGetMembersQuery();
  console.log(party);

  const members = party?.data || [];



  // States
  const [visibleColumns, setVisibleColumns] = useState(['name', 'partyType', 'contact', 'balance']);
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');

  useEffect(() => {
    dispatch(setActiveItem('members'));
  }, [dispatch]);

  // Modal handlers
  const openModal = (formType) => {
    setActiveModal(formType);
    setIsOpen(true);
  };

  const closeModal = () => {
    setActiveModal(null);
    setIsOpen(false);
  };

  // Filter members based on search term and type
  const filteredMembers = members.filter(member => {
    const search = searchTerm.toLowerCase();
    return (
      member.partyName?.toLowerCase().includes(search) ||
      member.email?.toLowerCase().includes(search)
      // Remove `member.phone` since you're not using it
    );
    const matchesType = filterType === 'All Types' || member.partyType === filterType;
    
    return matchesSearch && matchesType;
  });

  console.log(filteredMembers);

  // Define table columns for members
  const columns = [
    {
      key: 'name',
      label: 'Party Name',
      render: (value, item) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-medium text-sm">
              {item.partyName ? item.partyName.charAt(0).toUpperCase() : 'N'}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{item.partyName}</div>
            <div className="text-sm text-gray-500">{item.partyId || `PID-${item.id}`}</div>
          </div>
        </div>
      )
    },
    {
      key: 'partyType',
      label: 'Type',
      render: (value, item) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          item.partyType === 'Client' ? 'bg-green-100 text-green-800' :
          item.partyType === 'Material Supplier' ? 'bg-blue-100 text-blue-800' :
          item.partyType === 'Staff' ? 'bg-purple-100 text-purple-800' :
          item.partyType === 'Worker' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {item.partyType}
        </span>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (value, item) => (
        <div>
          <div className="text-sm text-gray-900">{item.phone}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      )
    },
    {
      key: 'balance',
      label: 'Opening Balance',
      render: (value, item) => (
        <div className="text-right">
          <span className={`font-medium ${
            item.openingBalance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ₹ {item.openingBalance?.toLocaleString() || '0'}
          </span>
        </div>
      )
    },
    {
      key: 'bankAccount',
      label: 'Bank Account',
      render: (value) => {
        if (!value || typeof value !== 'object') return '-';
        return (
          <div className="text-sm text-gray-700 leading-tight">
            <div>Acc: {value.accountNumber || '--'}</div>
            <div>Bank: {value.bankName || '--'}</div>
            <div>IFSC: {value.ifscCode || '--'}</div>
          </div>
        );
      }
    },
  ];

  const handleColumnToggle = (columnKey) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.filter(key => key !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  const handleDeleteMember = (member) => {
    if (window.confirm(`Are you sure you want to delete ${member.partyName}?`)) {
      dispatch(deleteParty(member.id));
    }
  };

  const handleDuplicateMember = (member) => {
    // Create a copy with modified name and new ID
    const duplicatedMember = {
      ...member,
      id: Date.now().toString(), // Generate new ID
      partyName: `${member.partyName} (Copy)`,
      partyId: `PID-${Date.now().toString().slice(-6)}`,
      email: `copy_${member.email}`,
      createdAt: new Date().toISOString()
    };
    dispatch(addParty(duplicatedMember));
  };

  const handleEditMember = (member) => {
    // You can implement edit functionality here
    // For now, let's open the modal with pre-filled data
    console.log('Edit member:', member);
    // You might want to pass the member data to the modal for editing
    openModal(FORM_TYPES.PARTY);
  };

  // Custom actions for members table
  const memberActions = [
    {
      label: 'Edit',
      onClick: handleEditMember,
      className: 'text-blue-600 hover:text-blue-900'
    },
    {
      label: 'Duplicate',
      onClick: handleDuplicateMember,
      className: 'text-green-600 hover:text-green-900'
    },
    {
      label: 'Delete', 
      onClick: handleDeleteMember,
      className: 'text-red-600 hover:text-red-900'
    }
  ];

  // Get unique party types for filter dropdown
  const partyTypes = ['All Types', ...new Set(members.map(m => m.partyType).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <Header title="Members" notificationCount={2} /> */}
      
      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Members</h1>
            <p className="text-gray-600">Manage party members and their details</p>
          </div>
          <button
            onClick={() => openModal(FORM_TYPES.PARTY)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>+</span>
            Add Party
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{members.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Clients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {members.filter(m => m.partyType === 'Client').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Handshake className="text-green-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {members.filter(m => m.partyType?.includes('Supplier')).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Factory className="text-yellow-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹ {members.reduce((sum, member) => sum + (member.openingBalance || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Landmark className="text-purple-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border-white mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {partyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500">
                Showing {filteredMembers.length} of {members.length} members
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Members</label>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 bottom-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <ReusableTable
            data={filteredMembers}
            columns={columns}
            visibleColumns={visibleColumns}
            onEditProject={handleEditMember}
            onColumnToggle={handleColumnToggle}

            onDuplicateProject={handleDuplicateMember}
            emptyMessage="No members found. Try adjusting your search or filters, or click 'Add Party' to get started."
            customActions={memberActions}
          />
        </div>
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

export default Members;