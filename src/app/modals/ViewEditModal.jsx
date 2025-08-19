import React from 'react';

const ViewModal = ({ 
  isOpen, 
  onClose, 
  selectedItem, 
  columns, 
  onEdit, 
  onDuplicate 
}) => {
  if (!isOpen || !selectedItem) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-transparent bg-opacity-25 z-40"
        onClick={onClose}
      />
      
      {/* Modal Slide Panel */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">View Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto h-full pb-24">
          <div className="space-y-4">
            {columns.map((column) => (
              <div key={column.key} className="border-b border-gray-100 pb-3">
                <dt className="text-sm font-medium text-gray-500 mb-1">{column.label}</dt>
                <dd className="text-sm text-gray-900">
                  {column.render ? 
                    column.render(selectedItem[column.key], selectedItem) : 
                    (selectedItem[column.key] || '-')
                  }
                </dd>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onDuplicate(selectedItem)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Duplicate
          </button>
          <button
            onClick={() => onEdit(selectedItem)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewModal;