// Enhanced DynamicModal Component with Dynamic Form Config

"use client"
import React, { useState, useEffect,useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, ChevronDown, Upload, Calendar, Clock, Search, ArrowLeft } from 'lucide-react';
import { addParty } from '../store/partySlice';
import { addTodo } from '../store/todoSlice';
import { addTimesheet } from '../store/timeSlice';
import { addLead, updateLead } from '../store/leadSlice';
import { addMom } from '../store/momSlice';
import { formConfigs, FORM_TYPES } from '../config/formConfig';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { 
  initializeForm, 
  updateFormField, 
  saveTransaction, 
  clearCurrentForm 
} from '../store/transactionField';
import {useAddMemberMutation,useGetMembersQuery,useUpdateMemberMutation} from '../store/api.js'
import {useAddProjectMutation,useGetAllProjectsQuery,useAddTimeSheetMutation}  from '../store/api'
import { goBackToOptions } from '../store/transactionOptionSlice';

const DynamicModal = ({ isOpen, onClose, formType = FORM_TYPES.PARTY, initialData }) => {
  const dispatch = useDispatch();
  
  // RTK Query hooks
  const [addMember, { isLoading: isAddingMember, error: addMemberError }] = useAddMemberMutation();
  const [updateMember, { isLoading: isUpdatingMember, error: updateMemberError }] = useUpdateMemberMutation();
  const [addProject, { isLoading: isAddingProject, error: addProjectError }] = useAddProjectMutation();
  const [addTimesheets,{isLoading:isAddingTimeSheet,error:addTimesheet}] = useAddTimeSheetMutation()
  
  // Fetch API data for dynamic options
  const { data: userProjects = [], isLoading: projectsLoading } = useGetAllProjectsQuery();
  const { data: userMembers = [], isLoading: membersLoading } = useGetMembersQuery();
  const { data: projects } = useGetAllProjectsQuery();
console.log(userProjects.data)
  // Get transaction-specific state
  const { 
    fieldConfigs, 
    currentFormData, 
    formErrors 
  } = useSelector(state => state.transactionFields);
  
  const { selectedOption } = useSelector(state => state.transactionOptions);

  // Dynamic form config enhancement
 // Dynamic form config enhancement
const enhanceFormConfig = useMemo(() => {
  if (!formConfigs[formType]) return null;

  // Helper functions for dynamic options with null safety
  const getProjectSearchOptions = () => {
    const projectsData = userProjects?.data || userProjects || [];
    return projectsData.map(p => ({
      value: p._id,
      label: p.projectName || p.name
    }));
  };

  const getMemberSearchOptions = () => {
    const membersData = userMembers?.data || userMembers || [];
    return membersData.map(m => ({
      value: m._id,
      label: m.name || m.partyName
    }));
  };

  const getPartySearchOptions = () => {
    const membersData = userMembers?.data || userMembers || [];
    const projectsData = userProjects?.data || userProjects || [];
    const memberOptions = membersData.map(m => ({
      value: m._id,
      label: m.partyName || m.name,
      type: 'member'
    }));
    
    const projectOptions = projectsData.map(p => ({
      value: p._id,
      label: p.projectName || p.name,
      type: 'project'
    }));  
    
    return [...memberOptions, ...projectOptions];
  };

  // Enhanced config with dynamic data
  return {
    ...formConfigs[formType],
    fields: formConfigs[formType].fields.map(field => {
      const enhancedField = { ...field };

      // Add searchOptions for search type fields
      if (field.type === 'search') {
        switch (field.name) {
          case 'partyName':
            enhancedField.searchOptions = getPartySearchOptions();
            break;
          case 'projectName':
          case 'selectProject':
            enhancedField.searchOptions = getProjectSearchOptions();
            break;
          case 'assigneeName':
          case 'leadAssignee':
          case 'attendee':
            enhancedField.searchOptions = getMemberSearchOptions();
            break;
        }
      }

      return enhancedField;
    })
  };
}, [formType, userProjects?.data, userMembers?.data]);


console.log(enhanceFormConfig)

  // Determine if this is a transaction form
  // Determine if this is a transaction form
const isTransactionForm = selectedOption && Object.keys(fieldConfigs || {}).includes(selectedOption.id);

// Get the config
const config = isTransactionForm 
  ? fieldConfigs[selectedOption?.id] 
  : enhanceFormConfig;

  // Local state for non-transaction forms
  const [localFormData, setLocalFormData] = useState(config?.defaultValues || {});
  console.log(localFormData)
  const [localErrors, setLocalErrors] = useState({});
  const [dropdownStates, setDropdownStates] = useState({});

  // Use appropriate form data and errors
  const formData = isTransactionForm ? currentFormData : localFormData;
  console.log(formData)
  const errors = isTransactionForm ? formErrors : localErrors;
  useEffect(() => {
    if (isTransactionForm && selectedOption) {
      dispatch(initializeForm(selectedOption.id));
    } else if (config) {
      const defaultVals = config.defaultValues || {};
      setLocalFormData(prev => (
        JSON.stringify(prev) === JSON.stringify(defaultVals) ? prev : defaultVals
      ));
      setLocalErrors({});
    }
    setDropdownStates({});
  }, [formType, selectedOption?.id, config?.title]);
  
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
      console.log('Updated timesheet data:', updatedData);
      
      if (updatedData.start && updatedData.stop) {
        const duration = calculateDuration(updatedData.start, updatedData.stop);
        console.log('Calculated duration:', duration);
        
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
    const startTime = parseTime(start);
    const stopTime = parseTime(stop);
    if (stopTime <= startTime) return 'Invalid: Stop before Start';
    const diffMs = stopTime - startTime;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}h ${diffMins}m`;
  };

  const handleDropdownSelect = (fieldName, value, selectedOption = null) => {
    if (isTransactionForm) {
      dispatch(updateFormField({ field: fieldName, value }));

    } else {
      setLocalFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));
    }

    // Store ID separately for backend if selectedOption provided
    if (selectedOption) {
      const idFieldName = `${fieldName}_id`;
      if (isTransactionForm) {
        dispatch(updateFormField({ field: idFieldName, value: selectedOption.value }));
      } else {
        setLocalFormData(prev => ({
          ...prev,
          [idFieldName]: selectedOption.value
        }));
      }
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

  // Time parsing functions
  const parseTime = (timeStr) => {
    if (!timeStr || timeStr.trim() === '') return null;
    
    try {
      const [hours, minutes] = timeStr.split(':');
      if (!hours || !minutes) return null;
      
      const date = new Date();
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      return date;
    } catch (error) {
      console.error('Error parsing time:', error);
      return null;
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    
    try {
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!config?.fields) return false;
  
    config.fields.forEach(field => {
      const fieldValue = formData[field.name];
  
      console.log(`${field.name}:`, fieldValue);
      
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
  
      if (typeof field.validation?.validate === 'function') {
        const validationResult = field.validation.validate(fieldValue, formData);
        if (validationResult !== true) {
          newErrors[field.name] = validationResult || `${field.label} is invalid`;
        }
      }
    });
  
    if (isTransactionForm) {
      // dispatch(setFormErrors(newErrors));
    } else {
      setLocalErrors(newErrors);
    }
  
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    console.log('Save button clicked');
    console.log('Form data:', formData);
    console.log('Form type:', formType);
    
    if (validateForm()) {
      console.log('Form validation passed');
      
      try {
        if (isTransactionForm) {
          dispatch(saveTransaction());
          console.log("Transaction saved");
        } else {
          console.log('Processing non-transaction form');
          
          switch (formType) {
            case FORM_TYPES.PARTY:
              console.log('Adding party member with data:', formData);
              
              if (initialData) {
                const result = await updateMember({ 
                  id: initialData.id, 
                  ...formData 
                }).unwrap();
                console.log('Member updated successfully:', result);
                alert('Member updated successfully!');
              } else {
                const result = await addMember(formData).unwrap();
                console.log('Member added successfully:', result);
                alert('Member added successfully!');
              }
              break;
              
            case FORM_TYPES.TODO:
              console.log('Adding todo');
              dispatch(addTodo(formData));
              break;
              
            case FORM_TYPES.TIMESHEET:
              console.log('Adding timesheet',formData);
              
              // Prepare timesheet data with proper field mapping
              const timesheetData = {
                workDate: formData.date,
                duration: formData.duration,  
                projectId: formData.projectName_id || formData.project_id, // Use stored ID
                partyId:formData.partyName_id || formData.party_id,
                startTime: formData.start,
                endTime: formData.stop,
                remarks: formData.remarks,
                taskName: formData.taskName,

              };
              
              console.log('Timesheet data being sent:', timesheetData);
              const timesheetResult = await addTimesheets(timesheetData);
              console.log('TimeSheet added successfully:', timesheetResult);
              break;
              
            case FORM_TYPES.MOM:
              console.log('Adding MOM');
              dispatch(addMom(formData));
              break;
              
            case FORM_TYPES.LEAD:
              console.log('Adding/Updating lead');
              if (initialData) {
                dispatch(updateLead({ id: initialData.id, ...formData }));
              } else {
                dispatch(addLead(formData));
              }
              break;
              
            case FORM_TYPES.PROJECT:
              console.log('Adding project');
              const projectResult = await addProject(formData).unwrap();
              console.log('Project added successfully:', projectResult);
              alert('Project added successfully!');
              break;
              
            default:
              console.log('Unknown form type:', formType);
              alert('Unknown form type: ' + formType);
              break;
          }
        }
        
        handleCancel();
        
      } catch (error) {
        console.error('Error saving data:', error);
        
        const errorMessage = error?.data?.message || 
                           error?.message || 
                           'Failed to save data. Please try again.';
        alert('Error: ' + errorMessage);
      }
    } else {
      console.log('Form validation failed');
      console.log('Errors:', errors);
      alert('Please fill in all required fields correctly.');
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

  // Enhanced search field renderer
  const renderSearchField = (field) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const isDropdownOpen = dropdownStates[field.name];
    const searchOptions = field.searchOptions || [];

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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            onFocus={() => setDropdownStates(prev => ({ ...prev, [field.name]: true }))}
          />
          <Search size={16} className="absolute right-3 top-3 text-gray-400" />
          
          {/* Dynamic dropdown with API data */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {(projectsLoading || membersLoading) ? (
                <div className="p-3 text-center text-gray-500">Loading...</div>
              ) : (
                <div className="p-2">
                  {searchOptions.length > 0 ? (
                    searchOptions
                      .filter(option => 
                        option?.label?.toLowerCase().includes(value.toLowerCase())
                      )
                      .map((option, index) => (
      <div
key={`${option.value}-${option.label}`}
         className="cursor-pointer hover:bg-gray-50 p-2 rounded text-sm"
                          onClick={() => handleDropdownSelect(field.name, option.label, option)}
                        >
                          {option.label}
                        </div>
                      ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">
                      No {field.name.includes('project') ? 'projects' : 'options'} available
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };

  const renderField = (field) => {
    console.log('Rendering field:', field.name, 'type:', field.type, 'value:', formData[field.name]);

    const value = formData[field.name] || '';
    const error = errors[field.name];
    const isDropdownOpen = dropdownStates[field?.name];

    const baseInputClass = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error ? 'border-red-300' : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'search':
        return renderSearchField(field);

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
       
      case 'time':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <DatePicker
              selected={value && value.trim() ? parseTime(value) : null}
              onChange={(date) => {
                console.log(`Time selected for ${field.name}:`, date);
                const formatted = formatTime(date);
                console.log(`Formatted time for ${field.name}:`, formatted);
                handleInputChange({ target: { name: field.name, value: formatted } });
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="HH:mm"
              placeholderText={field.placeholder || 'Select time'}
              className={baseInputClass}
              timeFormat="HH:mm"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type="date"
              name={field.name}
              value={value}
              onChange={handleInputChange}
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
                  {field.options.length === 0 && (
                    <div className="p-3 text-center text-gray-500">
                      No options available
                    </div>
                  )}
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

  const isLoading = isAddingMember || isUpdatingMember || isAddingProject || isAddingTimeSheet;

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
                  disabled={isLoading}
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
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 p-1"
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-4 space-y-4">
            {config.fields?.map(renderField)}
            
            {/* Show any API errors */}
            {(addMemberError || updateMemberError || addProjectError || addTimesheet) && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-md">
                <p className="text-sm text-red-600">
                  Error: {addMemberError?.data?.message || 
                          updateMemberError?.data?.message || 
                          addProjectError?.data?.message ||
                          addTimesheet?.data?.message ||
                          'Something went wrong'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicModal;