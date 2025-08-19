"use client"
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, Plus, CheckCircle, Circle } from 'lucide-react';
import Table from '../component/table/Table.jsx';
import DynamicModal from '../component/DynamicModal.jsx';
import { FORM_TYPES } from '../config/formConfig.js';
import { addTodo, updateTodo, deleteTodo, toggleTodoStatus } from '../store/todoSlice.js';

const Todo = () => {
  const dispatch = useDispatch();
  
  // Redux state (uncomment when slice is ready)
  // const { todos, loading, error } = useSelector(state => state.todos);
  
  // Mock data for now
  const todos = [
    {
      id: 1,
      itemName: 'Copy of oiuyt',
      dueDate: '15 Aug',
      assigned: 'Sagar',
      project: 'Sagaras',
      type: '--',
      completed: false
    },
    {
      id: 2,
      itemName: 'oiuyt',
      dueDate: '15 Aug',
      assigned: 'Sagar',
      project: 'Sagaras',
      type: '--',
      completed: false
    }
  ];

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [typeFilter, setTypeFilter] = useState('TYPE');
  const [searchTerm, setSearchTerm] = useState('');

  // Visible columns state for Table component
  const [visibleColumns, setVisibleColumns] = useState(['itemName', 'dueDate', 'assigned', 'project', 'type']);

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
    return dateString;
  };

  // Define table columns
  const columns = [
    {
      key: 'itemName',
      label: 'Item Name',
      render: (value, item) => (
        <div className="flex items-center">
          <button
            onClick={() => handleToggleStatus(item.id)}
            className="mr-3 text-gray-400 hover:text-green-500 transition-colors"
          >
            {item.completed ? (
              <CheckCircle size={18} className="text-green-500" />
            ) : (
              <Circle size={18} />
            )}
          </button>
          <span className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {value || 'Untitled'}
          </span>
        </div>
      )
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value) => (
        <div className="text-sm text-gray-900">
          {formatDate(value)}
        </div>
      )
    },
    {
      key: 'assigned',
      label: 'Assigned',
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
      key: 'type',
      label: 'Type',
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

  // Filter todos based on search term and filters
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.assigned?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.project?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'PENDING' ? !todo.completed : todo.completed;
    const matchesType = typeFilter === 'TYPE' || todo.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Action handlers
  const handleEditTodo = (todo) => {
    console.log('Edit todo:', todo);
    // Pass todo data to modal for editing
    openModal(FORM_TYPES.TODO);
  };

  const handleDuplicateTodo = (todo) => {
    const duplicatedTodo = {
      ...todo,
      id: undefined, // Remove ID so new one will be generated
      itemName: `${todo.itemName} (Copy)`,
      completed: false,
      createdAt: new Date().toISOString()
    };
    // dispatch(addTodo(duplicatedTodo));
    console.log('Duplicate todo:', duplicatedTodo);
  };

  const handleToggleStatus = (todoId) => {
    // dispatch(toggleTodoStatus(todoId));
    console.log('Toggle status for todo:', todoId);
  };

  const handlePinTodo = (todoId) => {
    // Pin functionality can be added here
    console.log('Pin todo:', todoId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === 'PENDING'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                PENDING
              </button>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="TYPE">TYPE</option>
                <option value="Task">Task</option>
                <option value="Bug">Bug</option>
                <option value="Feature">Feature</option>
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

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
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Button */}
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Premium Plan Badge */}
           
            
            {/* New Todo Button */}
            <button
              onClick={() => openModal(FORM_TYPES.TODO)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus size={16} />
              New To Do
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="p-6">
        {/* Table Component */}
        <Table
          data={filteredTodos}
          columns={columns}
          visibleColumns={visibleColumns}
          onColumnToggle={handleColumnToggle}
          onPinProject={handlePinTodo}
          onDuplicateProject={handleDuplicateTodo}
          onEditProject={handleEditTodo}
          pinnedProjects={[]} // No pinned functionality for todos
          emptyMessage="No todos found. Click 'New To Do' to get started."
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

export default Todo;