import { ChevronDown, X } from 'lucide-react';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

  const TransactionOptionSelector = ({iconMap,selectOption,onClose}) => {
    const dispatch = useDispatch();
    const { options, isModalOpen, step } = useSelector(state => state.transactionOptions);

    const handleSelectOption = (optionId) => {
      dispatch(selectOption(optionId));
    };

    const handleClose = () => {
      dispatch(closeModal());
    };

    if (step !== 'option-selector') return null;

    return (
      <>
        <style jsx>{`
          @keyframes slideInRight {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          .slide-in-right { animation: slideInRight 0.3s ease-out; }
          .backdrop-fade-in { animation: fadeIn 0.3s ease-out; }
          @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        `}</style>

        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-transparent bg-opacity-50 backdrop-fade-in" onClick={handleClose}></div>
          
          <div className="relative bg-white w-full max-w-md h-full overflow-y-auto slide-in-right shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Create Transaction</h2>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-600 mb-6">Select transaction type:</p>
              
              {options.map((option) => {
                const IconComponent = iconMap[option.icon] || Plus;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full p-4 rounded-lg border-2 bg-${option.color}-50 border-${option.color}-200 hover:border-opacity-80 transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full bg-${option.color}-100`}>
                        <IconComponent size={24} className={`text-${option.color}-600`} />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-semibold text-gray-900">{option.name}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      <ChevronDown size={16} className="text-gray-400 transform rotate-[-90deg]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  };

export default TransactionOptionSelector
