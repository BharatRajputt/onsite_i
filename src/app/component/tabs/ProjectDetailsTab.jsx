"use client"
import React from 'react';

const ProjectDetailsTab = ({ projectData, handleInputChange }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          S
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Project Avatar</h3>
          <p className="text-sm text-gray-500">Represents your project visually</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">PROJECT NAME</label>
          <input
            type="text"
            value={projectData.projectName}
            onChange={(e) => handleInputChange('projectName', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-gray-50/50 hover:border-gray-300"
          />
        </div>
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">PROJECT CODE</label>
          <input
            type="text"
            value={projectData.projectCode}
            onChange={(e) => handleInputChange('projectCode', e.target.value)}
            placeholder="Enter project code"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-gray-50/50 hover:border-gray-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">Start Date</label>
          <input
            type="date"
            value={projectData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-gray-50/50 hover:border-gray-300"
          />
        </div>
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">End Date</label>
          <input
            type="date"
            value={projectData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            min={projectData.startDate || undefined}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-gray-50/50 hover:border-gray-300"
          />
        </div>
      </div>

      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">PROJECT ADDRESS</label>
        <textarea
          value={projectData.projectAddress}
          onChange={(e) => handleInputChange('projectAddress', e.target.value)}
          rows={4}
          placeholder="Enter complete project address..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none bg-gray-50/50 hover:border-gray-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">ATTENDANCE RADIUS (meters)</label>
          <input
            type="number"
            value={projectData.attendanceRadius}
            onChange={(e) => handleInputChange('attendanceRadius', e.target.value)}
            placeholder="500"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-gray-50/50 hover:border-gray-300"
          />
        </div>
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">PROJECT VALUE (₹)</label>
          <input
            type="number"
            value={projectData.projectValue}
            onChange={(e) => handleInputChange('projectValue', e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-gray-50/50 hover:border-gray-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">PROJECT ORIENTATION</label>
          <select
            value={projectData.projectOrientation}
            onChange={(e) => handleInputChange('projectOrientation', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-gray-50/50 hover:border-gray-300"
          >
            <option value="">Select orientation</option>
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="east">East</option>
            <option value="west">West</option>
          </select>
        </div>
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">PROJECT DIMENSION</label>
          <select
            value={projectData.projectDimension}
            onChange={(e) => handleInputChange('projectDimension', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-gray-50/50 hover:border-gray-300"
          >
            <option value="">Select dimension</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsTab;