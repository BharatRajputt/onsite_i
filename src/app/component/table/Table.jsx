"use client"
import React, { useState, useEffect } from 'react';
import { CirclePlus, Pin, MoreHorizontal } from 'lucide-react';
import ViewModal from '@/app/modals/ViewEditModal';

const Table = ({ 
  data = [], 
  columns = [], 
  onColumnToggle,
  visibleColumns = [],
  emptyMessage = "No data available",
  onPinProject,
  onDuplicateProject,
  onEditProject,
  pinnedProjects = []
}) => {
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [animatingColumns, setAnimatingColumns] = useState(new Set());
  const [buttonRef, setButtonRef] = useState(null);
  const handleColumnToggle = (columnKey) => {
    // Don't allow hiding the 'name' column
    if (columnKey === 'name') return;
    
    setAnimatingColumns(prev => new Set([...prev, columnKey]));
    
    // Add delay for animation
    setTimeout(() => {
      onColumnToggle(columnKey);
      setTimeout(() => {
        setAnimatingColumns(prev => {
          const newSet = new Set(prev);
          newSet.delete(columnKey);
          return newSet;
        });
      }, 300);
    }, 150);
  };

  const getDropdownPosition = () => {
    if (!buttonRef) return { top: 0, right: 0 };
    
    const rect = buttonRef.getBoundingClientRect();
    return {
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right
    };
  };
  const handlePinToggle = (projectId) => {
    onPinProject(projectId);
  };

  const handleViewClick = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedItem(null);
  };

  const handleEdit = (item) => {
    onEditProject(item);
    handleCloseModal();
  };

  const handleDuplicate = (item) => {
    onDuplicateProject(item);
    handleCloseModal();
  };

  const getVisibleColumns = () => {
    return columns.filter(col => visibleColumns.includes(col.key));
  };

  const getColumnAnimationClass = (columnKey) => {
    if (animatingColumns.has(columnKey)) {
      if (visibleColumns.includes(columnKey)) {
        // Hiding animation - slide to left
        return 'animate-slide-out-left';
      } else {
        // Showing animation - slide from right
        return 'animate-slide-in-right';
      }
    }
    return '';
  };

  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    return item[column.key] || '-';
  };

  return (
    <>
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideOutLeft {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
        }
        
        @keyframes slideInRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-out-left {
          animation: slideOutLeft 0.3s ease-in-out;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-in-out;
        }
        
        .column-transition {
          transition: all 0.3s ease-in-out;
        }
      `}</style>

      <div className="w-full">
        <div className={`transition-all duration-500 ease-out ${showViewModal ? 'mr-96 scale-[0.98]' : 'mr-0 scale-100'}`}>
          <div className="bg-white rounded-lg shadow-sm border-white overflow-hidden cursor-pointer">
          <table className="w-full">
            <thead className="bg-gray-50 border-white">
              <tr>
                {getVisibleColumns().map((column) => (
                  <th 
                    key={column.key}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider column-transition ${getColumnAnimationClass(column.key)}`}
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                  <div className="flex items-center justify-end">
                    <button
                      ref={setButtonRef}
                      onClick={() => setShowColumnSelector(!showColumnSelector)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <CirclePlus size={16} />
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={getVisibleColumns().length + 1} className="px-6 py-8 text-center text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    {getVisibleColumns().map((column) => (
                      <td 
                        key={column.key} 
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 column-transition ${getColumnAnimationClass(column.key)}`}
                      >
                        {renderCellContent(item, column)}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        {/* Pin Icon */}
                        <button
                          onClick={() => handlePinToggle(item.id)}
                          className={`p-1 rounded-full transition-colors ${
                            pinnedProjects.includes(item.id)
                              ? 'text-orange-500 hover:text-orange-600'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <Pin size={16} />
                        </button>
                        
                        {/* Three Dots Menu */}
                        <div className="relative">
                          <button
                            onClick={() => handleViewClick(item)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Column Selector Dropdown - Positioned absolutely to avoid clipping */}
      {showColumnSelector && (
        <div 
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] max-h-64 overflow-y-auto"
          style={getDropdownPosition()}
        >
          <div className="p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Show Columns</h4>
            <div className="space-y-2">
              {columns.map((column) => (
                <label key={column.key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.key)}
                    onChange={() => handleColumnToggle(column.key)}
                    disabled={column.key === 'name'}
                    className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                      column.key === 'name' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                  <span className={`text-sm ${
                    column.key === 'name' ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    {column.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close column selector */}
      {showColumnSelector && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowColumnSelector(false)} 
        />
      )}

      {/* View Modal Component */}
      <ViewModal
        isOpen={showViewModal}
        onClose={handleCloseModal}
        selectedItem={selectedItem}
        columns={columns}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
      />
    </div>
    </>
  );
};

export default Table;