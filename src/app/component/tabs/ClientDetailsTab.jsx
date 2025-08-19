"use client"
import React from 'react';
import { Upload, X } from 'lucide-react';

const ClientDetailsTab = ({ 
  projectData, 
  handleInputChange, 
  clientImage, 
  clientImagePreview, 
  handleImageUpload, 
  handleRemoveImage 
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-100">
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl flex items-center justify-center overflow-hidden shadow-lg transition-transform group-hover:scale-105">
              {clientImagePreview ? (
                <img 
                  src={clientImagePreview} 
                  alt="Client" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">C</span>
                </div>
              )}
            </div>
            {clientImagePreview && (
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-lg"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-col space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Client Avatar</h3>
              <input
                type="file"
                id="clientImageInput"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="clientImageInput"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 cursor-pointer font-medium text-sm"
              >
                <Upload size={16} />
                <span>{clientImagePreview ? 'Change Image' : 'Upload Image'}</span>
              </label>
              {clientImage && (
                <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-lg">
                  {clientImage.name} ({(clientImage.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">CLIENT NAME</label>
          <input
            type="text"
            value={projectData.clientName}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            placeholder="Enter client name"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-gray-50/50 hover:border-gray-300"
          />
        </div>
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">CLIENT MOBILE NUMBER</label>
          <input
            type="tel"
            value={projectData.clientMobile}
            onChange={(e) => handleInputChange('clientMobile', e.target.value)}
            placeholder="Enter mobile number"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-gray-50/50 hover:border-gray-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">CLIENT COMPANY NAME</label>
          <input
            type="text"
            value={projectData.clientCompanyName}
            onChange={(e) => handleInputChange('clientCompanyName', e.target.value)}
            placeholder="Enter company name"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-gray-50/50 hover:border-gray-300"
          />
        </div>
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">COMPANY ADDRESS</label>
          <input
            type="text"
            value={projectData.companyAddress}
            onChange={(e) => handleInputChange('companyAddress', e.target.value)}
            placeholder="Enter company address"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-gray-50/50 hover:border-gray-300"
          />
        </div>
      </div>

      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">COMPANY GST NUMBER</label>
        <input
          type="text"
          value={projectData.companyGstNumber}
          onChange={(e) => handleInputChange('companyGstNumber', e.target.value)}
          placeholder="Enter GST number (e.g., 22AAAAA0000A1Z5)"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-gray-50/50 hover:border-gray-300"
        />
      </div>
    </div>
  );
};

export default ClientDetailsTab;