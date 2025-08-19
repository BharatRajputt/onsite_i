"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ProjectSetting from '../modals/ProjectSetting';

export default function CreateProject() {
  const router = useRouter();
  const [showProjectSetting, setShowProjectSetting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    address: '',
    city: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setShowProjectSetting(true);
    }
  };

  const handleBack = () => {
    router.push('/projects');
  };

  const handleCloseProjectSetting = () => {
    setShowProjectSetting(false);
    router.push('/projects');
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden border-white rounded-2xl">
  {/* Right Side Purple Background */}
  <div className="absolute top-0 right-0  h-full bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-l-[3rem]"></div>

  {/* Corner Blend Elements */}
  <div className="absolute top-0 right-1/2 w-32 h-32 bg-gradient-to-br from-transparent via-purple-200 to-purple-600 opacity-30 rounded-full transform translate-x-16 -translate-y-16"></div>
  <div className="absolute bottom-0 right-1/2 w-32 h-32 bg-gradient-to-tr from-transparent via-purple-200 to-purple-600 opacity-30 rounded-full transform translate-x-16 translate-y-16 "></div>

  {/* Purple Side Decorative Elements */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full opacity-20 transform translate-x-32 -translate-y-32"></div>
  <div className="absolute top-20 right-20 w-64 h-64 bg-purple-400 rounded-full opacity-15 transform rotate-45"></div>
  <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600 rounded-full opacity-20 transform translate-x-40 translate-y-40"></div>
  <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-300 rounded-full opacity-10"></div>

  {/* White Side Subtle Elements */}
  <div className="absolute top-10 left-10 w-24 h-24 bg-gray-100 rounded-full opacity-50"></div>
  <div className="absolute bottom-32 left-20 w-16 h-16 bg-gray-200 rounded-full opacity-40"></div>

  {/* Back Button */}
  <div className="absolute top-6 left-6 z-20">
    <button
      onClick={handleBack}
      className="p-2 top-8 fixed bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 text-gray-700 shadow-sm"
    >
      <ArrowLeft size={20} />
    </button>
  </div>

  {/* Centered Form */}
  <div className="flex items-center justify-center min-h-screen p-6 relative z-10">
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 ">Creating Project</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Details</h2>
        </div>

        <div className="space-y-6">
          {/* Project Name */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                errors.projectName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
              }`}
              placeholder="Project Name"
            />
            {errors.projectName && <p className="mt-2 text-sm text-red-600">{errors.projectName}</p>}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 resize-none ${
                errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
              }`}
              placeholder="Address"
            />
            {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
              }`}
              placeholder="City"
            />
            {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city}</p>}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Continue
          </button>
        </div>
      </div>

      
    </div>
  </div>

  {/* Project Setting Modal */}
  {showProjectSetting && (
    <ProjectSetting onClose={handleCloseProjectSetting} initialData={formData} />
  )}
</div>

  );
}