"use client"
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, ChevronDown, Upload, Edit } from 'lucide-react';
import { addMember } from '../store/memberSlice';

const AddPartyModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    partyName: '',
    phone: '',
    email: '',
    partyType: 'Material Supplier',
    openingBalance: 0,
    bankAccount: '',
    address: '',
    aadhaar: '',
    pan: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPartyTypes, setShowPartyTypes] = useState(false);

  const partyTypes = [
    'Client',
    'Staff',
    'Worker', 
    'Investor',
    'Vendor',
    'Labour Contractor',
    'Material Supplier',
    'Equipment Supplier',
    'Subcontractor',
    'Other Vendor'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePartyTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      partyType: type
    }));
    setShowPartyTypes(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.partyName.trim()) {
      newErrors.partyName = 'Party name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      dispatch(addMember(formData));
      
      // Reset form
      setFormData({
        partyName: '',
        phone: '',
        email: '',
        partyType: 'Material Supplier',
        openingBalance: 0,
        bankAccount: '',
        address: '',
        aadhaar: '',
        pan: '',
        password: ''
      });
      
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      partyName: '',
      phone: '',
      email: '',
      partyType: 'Material Supplier',
      openingBalance: 0,
      bankAccount: '',
      address: '',
      aadhaar: '',
      pan: '',
      password: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Custom CSS for slide animations */}
      <style jsx>{`
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
        
        @keyframes slideOutRight {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        
        .slide-out-right {
          animation: slideOutRight 0.3s ease-in;
        }
        
        .backdrop-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Transparent backdrop - no darkening */}
        <div 
          className="absolute inset-0 backdrop-fade-in"
          onClick={handleCancel}
        ></div>
        
        {/* Modal */}
        <div className="relative bg-white w-full max-w-md h-full overflow-y-auto slide-in-right shadow-2xl border-l border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">ADD PARTY</h2>
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

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Party Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PARTY</label>
            <input
              type="text"
              name="partyName"
              value={formData.partyName}
              onChange={handleInputChange}
              placeholder="Party Name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.partyName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.partyName && (
              <p className="mt-1 text-sm text-red-600">{errors.partyName}</p>
            )}
          </div>

          {/* Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PHONE</label>
              <div className="flex">
                <div className="flex items-center px-3 py-2 border border-r-0 rounded-l-md bg-gray-50">
                  <img src="https://flagcdn.com/16x12/in.png" alt="IN" className="mr-1" />
                  <span className="text-sm">+91</span>
                  <ChevronDown size={14} className="ml-1" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className={`flex-1 px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">EMAIL</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PASSWORD</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Party Type Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPartyTypes(!showPartyTypes)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-gray-700">{formData.partyType}</span>
              <ChevronDown size={16} />
            </button>
            
            {showPartyTypes && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                <div className="p-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Party Type</div>
                  <div className="space-y-2">
                    {partyTypes.map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="radio"
                          name="partyType"
                          value={type}
                          checked={formData.partyType === type}
                          onChange={() => handlePartyTypeSelect(type)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Opening Balance */}
          <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
            <div className="flex items-center">
              <span className="text-lg mr-2">₹</span>
              <span className="text-gray-700">Opening Balance</span>
            </div>
            <input
              type="number"
              name="openingBalance"
              value={formData.openingBalance}
              onChange={handleInputChange}
              className="text-right border-none outline-none bg-transparent"
              placeholder="0"
            />
          </div>

          {/* Bank Account */}
          <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
            <div className="flex items-center">
              <div className="w-8 h-6 bg-gray-200 rounded mr-2"></div>
              <span className="text-gray-700">Bank Account</span>
            </div>
            <input
              type="text"
              name="bankAccount"
              value={formData.bankAccount}
              onChange={handleInputChange}
              className="text-right border-none outline-none bg-transparent"
              placeholder="--NA--"
            />
          </div>

          {/* Address */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Your Address</span>
              <button className="text-blue-600 text-sm">+Add</button>
            </div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter address"
              rows={2}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Party ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PARTY ID</label>
            <div className="flex items-center">
              <input
                type="text"
                value="PID-2"
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
              />
              <button className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-50">
                <Edit size={16} />
              </button>
            </div>
          </div>

          {/* Aadhaar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AADHAAR</label>
            <div className="flex items-center">
              <input
                type="text"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleInputChange}
                placeholder="Aadhaar number"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-50">
                <Upload size={16} />
              </button>
            </div>
          </div>

          {/* PAN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN</label>
            <div className="flex items-center">
              <input
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleInputChange}
                placeholder="PAN number"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-50">
                <Upload size={16} />
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default AddPartyModal;