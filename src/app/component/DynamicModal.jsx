"use client"
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, ChevronDown, Upload, Calendar, Clock, Search, ArrowLeft } from 'lucide-react';
import { addParty } from '../store/partySlice';
import { addTodo } from '../store/todoSlice';
import { addTimesheet } from '../store/timeSlice';
import { addLead, updateLead } from '../store/leadSlice';
import { addMom } from '../store/momSlice';
import { formConfigs, FORM_TYPES } from '../config/formConfig';
import { 
  initializeForm, 
  updateFormField, 
  saveTransaction, 
  clearCurrentForm 
} from '../store/transactionField';
import { goBackToOptions } from '../store/transactionOptionSlice';

const DynamicModal = ({ isOpen, onClose, formType = FORM_TYPES.PARTY, initialData }) => {
  const dispatch = useDispatch();
  
  // Get transaction-specific state
  const { 
    fieldConfigs, 
    currentFormData, 
    formErrors 
  } = useSelector(state => state.transactionFields);
  
  const { selectedOption } = useSelector(state => state.transactionOptions);
  
  // Determine if this is a transaction form
  const isTransactionForm = selectedOption && Object.keys(fieldConfigs).includes(selectedOption.id);
  
  // Get the appropriate config
  const config = isTransactionForm 
    ? fieldConfigs[selectedOption.id] 
    : formConfigs[formType];
  
  // Local state for non-transaction forms
  const [localFormData, setLocalFormData] = useState(config?.defaultValues || {});
  const [localErrors, setLocalErrors] = useState({});
  const [dropdownStates, setDropdownStates] = useState({});

  // Use appropriate form data and errors
  const formData = isTransactionForm ? currentFormData : localFormData;
  const errors = isTransactionForm ? formErrors : localErrors;

  useEffect(() => {
    if (isTransactionForm && selectedOption) {
      // Initialize transaction form
      dispatch(initializeForm(selectedOption.id));
    } else if (config) {
      // Initialize regular form
      setLocalFormData(config.defaultValues || {});
      setLocalErrors({});
    }
    setDropdownStates({});
  }, [formType, selectedOption, config, dispatch, isTransactionForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (isTransactionForm) {
      dispatch(updateFormField({ field: name, value }));
    } else {
      setLocalFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      if (localErrors[name]) {
        setLocalErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }

    // Auto-calculate duration for timesheet
    if (formType === FORM_TYPES.TIMESHEET && (name === 'start' || name === 'stop')) {
      const updatedData = { ...formData, [name]: value };
      if (updatedData.start && updatedData.stop) {
        const duration = calculateDuration(updatedData.start, updatedData.stop);
        if (isTransactionForm) {
          dispatch(updateFormField({ field: 'duration', value: duration }));
        } else {
          setLocalFormData(prev => ({ ...prev, duration }));
        }
      }
    }
  };

  const calculateDuration = (start, stop) => {
    if (!start || !stop) return '';
    
    const startTime = new Date(`2000-01-01 ${start}`);
    const stopTime = new Date(`2000-01-01 ${stop}`);
    
    if (stopTime <= startTime) return '';
    
    const diffMs = stopTime - startTime;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  const handleDropdownSelect = (fieldName, value) => {
    if (isTransactionForm) {
      dispatch(updateFormField({ field: fieldName, value }));
    } else {
      setLocalFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));
    }
    setDropdownStates(prev => ({
      ...prev,
      [fieldName]: false
    }));
  };

  const toggleDropdown = (fieldName) => {
    setDropdownStates(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!config?.fields) return false;
    
    config.fields.forEach(field => {
      const fieldValue = formData[field.name];
      
      if (field.required && !fieldValue?.toString().trim()) {
        newErrors[field.name] = field.validation?.required || `${field.label} is required`;
      }
      
      if (field.validation?.pattern && fieldValue) {
        if (!field.validation.pattern.value.test(fieldValue)) {
          newErrors[field.name] = field.validation.pattern.message;
        }
      }
      
      if (field.validation?.minLength && fieldValue) {
        if (fieldValue.length < field.validation.minLength.value) {
          newErrors[field.name] = field.validation.minLength.message;
        }
      }
    });
    
    if (isTransactionForm) {
      // For transaction forms, you might want to dispatch setFormErrors
      // dispatch(setFormErrors(newErrors));
    } else {
      setLocalErrors(newErrors);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      if (isTransactionForm) {
        // Save transaction
        dispatch(saveTransaction());
      } else {
        // Handle other form types
        switch (formType) {
          case FORM_TYPES.PARTY:
            dispatch(addParty(formData));
            break;
          case FORM_TYPES.TODO:
            dispatch(addTodo(formData));
            break;
          case FORM_TYPES.TIMESHEET:
            dispatch(addTimesheet(formData));
            break;
          case FORM_TYPES.MOM:
            dispatch(addMom(formData));
            break;
          case FORM_TYPES.LEAD:
            if (initialData) {
              dispatch(updateLead({ id: initialData.id, ...formData }));
            } else {
              dispatch(addLead(formData));
            }
            break;
          default:
            break;
        }
      }
      
      handleCancel();
    }
  };

  const handleCancel = () => {
    if (isTransactionForm) {
      dispatch(clearCurrentForm());
    } else {
      setLocalFormData(config?.defaultValues || {});
      setLocalErrors({});
    }
    setDropdownStates({});
    onClose();
  };

  const handleGoBack = () => {
    if (isTransactionForm) {
      dispatch(goBackToOptions());
    }
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const isDropdownOpen = dropdownStates[field?.name];

    const baseInputClass = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error ? 'border-red-300' : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'url':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={value}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              className={baseInputClass}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type="number"
              name={field.name}
              value={value}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              className={baseInputClass}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'search':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <div className="relative">
              <input
                type="text"
                name={field.name}
                value={value}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                className={baseInputClass}
              />
              <Search size={16} className="absolute right-3 top-3 text-gray-400" />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <textarea
              name={field.name}
              value={value}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              className={baseInputClass}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={field.name}
                    value={option}
                    checked={value === option}
                    onChange={handleInputChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'dropdown':
        return (
          <div key={field.name} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <button
              type="button"
              onClick={() => toggleDropdown(field.name)}
              className={baseInputClass + " text-left flex items-center justify-between"}
            >
              <span className={value ? "text-gray-700" : "text-gray-400"}>
                {value || field.placeholder}
              </span>
              <ChevronDown size={16} />
            </button>
            
            {isDropdownOpen && field.options && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                <div className="p-2">
                  {field.options.map((option) => (
                    <div
                      key={option}
                      className="cursor-pointer hover:bg-gray-50 p-2 rounded text-sm"
                      onClick={() => handleDropdownSelect(field.name, option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'file':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            </div>
          </div>
        );

      case 'toggle':
        return (
          <div key={field.name} className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">{field.label}</label>
            <div className="relative">
              <input
                type="checkbox"
                name={field.name}
                checked={Boolean(value)}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  if (isTransactionForm) {
                    dispatch(updateFormField({ field: field.name, value: newValue }));
                  } else {
                    setLocalFormData(prev => ({ ...prev, [field.name]: newValue }));
                  }
                }}
                className="sr-only"
              />
              <div className={`block bg-gray-600 w-14 h-8 rounded-full ${value ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${value ? 'transform translate-x-6' : ''}`}></div>
            </div>
          </div>
        );

      case 'display':
        return (
          <div key={field.name} className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-gray-700">{field.label}</span>
            <span className={`text-sm ${field.bold ? 'font-bold' : ''} text-gray-900`}>
              {field.value || value}
            </span>
          </div>
        );

      case 'display_amount':
        return (
          <div key={field.name} className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-gray-700">{field.label}</span>
            <span className="text-sm font-bold text-gray-900">
              ₹ {(field.value || value || 0).toLocaleString()}
            </span>
          </div>
        );

      case 'button':
        return (
          <div key={field.name}>
            <button
              type="button"
              className="w-full p-3 border border-gray-300 rounded-md hover:bg-gray-50 text-left flex items-center justify-between"
            >
              <span className="text-gray-700">{field.label}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen || !config) return null;

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
        <div 
          className="absolute inset-0 backdrop-fade-in"
          onClick={handleCancel}
        ></div>
        
        <div className="relative bg-white w-full max-w-md h-full overflow-y-auto slide-in-right shadow-2xl border-l border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              {isTransactionForm && (
                <button
                  onClick={handleGoBack}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h2 className="text-lg font-semibold text-gray-900">{config.title}</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 px-3 py-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-4 space-y-4">
            {config.fields?.map(renderField)}
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicModal;