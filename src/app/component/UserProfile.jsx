"use client"
import React, { useState, useEffect } from 'react';
import { User, Camera, Edit3, Save, X, Phone, Mail, MapPin, Building, Calendar, Shield, Eye, EyeOff, LogOut, Settings, Loader } from 'lucide-react';
import { 
  useGetUserProfileQuery, 
  useUpdateUserProfileMutation,
  useUpdateUserImageMutation, 
  useUpdateUserTextMutation,
  useGetUserStatsQuery, 
  useChangePasswordMutation 
} from '../store/api';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [imageOnly, setImageOnly] = useState(false);
  
  // RTK Query hooks - All three APIs
  const { data: userProfile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useGetUserProfileQuery();
  const { data: userStats, isLoading: statsLoading } = useGetUserStatsQuery();
  const [updateProfile, { isLoading: updateLoading }] = useUpdateUserProfileMutation();
  const [updateImage, { isLoading: imageLoading }] = useUpdateUserImageMutation();
  const [updateText, { isLoading: textLoading }] = useUpdateUserTextMutation();
  const [changePassword, { isLoading: passwordLoading }] = useChangePasswordMutation();
  
  // Local state for editing
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    company: '',
    role: '',
    profileImage: null,
    newImageFile: null // For new image uploads
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update editData when profile data changes
  useEffect(() => {
    if (userProfile?.success && userProfile?.data) {
      const userData = userProfile.data;
      setEditData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: {
          street: userData.address?.street || '',
          city: userData.address?.city || '',
          state: userData.address?.state || '',
          pincode: userData.address?.pincode || '',
          country: userData.address?.country || 'India'
        },
        company: userData.company || '',
        role: userData.role || '',
        profileImage: userData.image || null,
        newImageFile: null
      });
    }
  }, [userProfile]);

  // Statistics data from RTK Query
  const stats = userStats?.success ? [
    { label: 'Total Projects', value: userStats.stats.totalProjects || 0, color: 'bg-blue-500' },
    { label: 'Active Members', value: userStats.stats.activeMembers || 0, color: 'bg-green-500' },
    { label: 'Completed Projects', value: userStats.stats.completedProjects || 0, color: 'bg-purple-500' },
    { label: 'Total Transactions', value: userStats.stats.totalTransactions || 0, color: 'bg-orange-500' }
  ] : [
    { label: 'Total Projects', value: 0, color: 'bg-blue-500' },
    { label: 'Active Members', value: 0, color: 'bg-green-500' },
    { label: 'Completed Projects', value: 0, color: 'bg-purple-500' },
    { label: 'Total Transactions', value: 0, color: 'bg-orange-500' }
  ];

  // Smart save function - uses appropriate API based on changes
  const handleSave = async () => {
    try {
      const hasNewImage = editData.newImageFile;
      const hasTextChanges = checkForTextChanges();

      if (hasNewImage && hasTextChanges) {
        // Use complete profile update API (FormData)
        const formData = new FormData();
        formData.append('name', editData.name);
        formData.append('phone', editData.phone);
        formData.append('company', editData.company);
        formData.append('role', editData.role);
        formData.append('address', JSON.stringify(editData.address));
        formData.append('userImg', editData.newImageFile);
        
        const result = await updateProfile(formData).unwrap();
        
        if (result.success) {
          alert('Profile updated successfully with image!');
          setIsEditing(false);
          refetchProfile();
        }
      } else if (hasNewImage && !hasTextChanges) {
        // Use image-only API
        const result = await updateImage(editData.newImageFile).unwrap();
        
        if (result.success) {
          alert('Profile image updated successfully!');
          setIsEditing(false);
          refetchProfile();
        }
      } else if (!hasNewImage && hasTextChanges) {
        // Use text-only API
        const textData = {
          name: editData.name,
          phone: editData.phone,
          company: editData.company,
          role: editData.role,
          address: editData.address
        };
        
        const result = await updateText(textData).unwrap();
        
        if (result.success) {
          alert('Profile updated successfully!');
          setIsEditing(false);
          refetchProfile();
        }
      } else {
        alert('No changes detected');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert(error?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  // Check for text field changes
  const checkForTextChanges = () => {
    if (!userProfile?.data) return false;
    
    const original = userProfile.data;
    return (
      editData.name !== (original.name || '') ||
      editData.phone !== (original.phone || '') ||
      editData.company !== (original.company || '') ||
      editData.role !== (original.role || '') ||
      editData.address.street !== (original.address?.street || '') ||
      editData.address.city !== (original.address?.city || '') ||
      editData.address.state !== (original.address?.state || '') ||
      editData.address.pincode !== (original.address?.pincode || '') ||
      editData.address.country !== (original.address?.country || 'India')
    );
  };

  // Immediate image update (optional feature)
  const handleImmediateImageUpdate = async (imageFile) => {
    try {
      const result = await updateImage(imageFile).unwrap();
      
      if (result.success) {
        alert('Profile image updated immediately!');
        refetchProfile();
        setEditData(prev => ({
          ...prev,
          profileImage: result.data.image,
          newImageFile: null
        }));
      }
    } catch (error) {
      console.error('Immediate image update error:', error);
      alert(error?.data?.message || 'Failed to update image');
    }
  };

  const handleCancel = () => {
    // Reset editData to current profile data
    if (userProfile?.success && userProfile?.data) {
      const userData = userProfile.data;
      setEditData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: {
          street: userData.address?.street || '',
          city: userData.address?.city || '',
          state: userData.address?.state || '',
          pincode: userData.address?.pincode || '',
          country: userData.address?.country || 'India'
        },
        company: userData.company || '',
        role: userData.role || '',
        profileImage: userData.image || null,
        newImageFile: null
      });
    }
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Maximum size is 5MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed.');
        return;
      }

      if (imageOnly) {
        // Immediate update
        handleImmediateImageUpdate(file);
      } else {
        // Store for batch update
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditData(prev => ({ 
            ...prev, 
            profileImage: reader.result, // For preview
            newImageFile: file // For API call
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        alert('All password fields are required');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert('New password and confirm password do not match');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        alert('New password must be at least 6 characters long');
        return;
      }

      const result = await changePassword(passwordData).unwrap();
      
      if (result.success) {
        alert('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Password change error:', error);
      alert(error?.data?.message || 'Failed to change password. Please try again.');
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        
        window.location.href = '/login';
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  // Loading state
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (profileError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">
            {profileError?.data?.message || profileError?.message || 'Failed to load profile'}
          </p>
          <button
            onClick={refetchProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get user data from RTK Query response
  const userDetails = userProfile?.data || {};

  // Loading overlay for any ongoing operations
  const isAnyLoading = updateLoading || imageLoading || textLoading || passwordLoading;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Loading Overlay */}
        {isAnyLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <Loader className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-700">
                  {updateLoading && 'Updating profile...'}
                  {imageLoading && 'Updating image...'}
                  {textLoading && 'Updating details...'}
                  {passwordLoading && 'Changing password...'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={isAnyLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'security'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* Profile Details Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto overflow-hidden">
                      {editData.profileImage ? (
                        <img 
                          src={editData.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{userDetails.name || 'User Name'}</h2>
                  <p className="text-gray-600">{userDetails.role || 'Role'}</p>
                  <p className="text-sm text-gray-500">{userDetails.company || 'Company'}</p>
                </div>

                {/* Image Update Options */}
                {isEditing && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={imageOnly}
                        onChange={(e) => setImageOnly(e.target.checked)}
                      />
                      <span>Update image immediately</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      {imageOnly ? 'Image will be updated instantly' : 'Image will be updated with other changes'}
                    </p>
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-3" />
                    {userDetails.email || 'No email provided'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-3" />
                    {userDetails.phone || 'No phone provided'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-3" />
                    Joined {userDetails.createdAt ? new Date(userDetails.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>

                <div className="mt-6">
                  {!isEditing ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Quick Edit
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('security')}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center border border-red-200"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={isAnyLoading}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        {isAnyLoading ? (
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isAnyLoading}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={isEditing ? editData.name : userDetails.name || ''}
                      onChange={(e) => isEditing && setEditData({...editData, name: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={userDetails.email || ''}
                      disabled={true}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={isEditing ? editData.phone : userDetails.phone || ''}
                      onChange={(e) => isEditing && setEditData({...editData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={isEditing ? editData.company : userDetails.company || ''}
                      onChange={(e) => isEditing && setEditData({...editData, company: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={isEditing ? editData.role : userDetails.role || ''}
                      onChange={(e) => isEditing && setEditData({...editData, role: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-medium transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Address Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      value={isEditing ? editData.address?.street : userDetails.address?.street || ''}
                      onChange={(e) => isEditing && setEditData({
                        ...editData, 
                        address: {...editData.address, street: e.target.value}
                      })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={isEditing ? editData.address?.city : userDetails.address?.city || ''}
                      onChange={(e) => isEditing && setEditData({
                        ...editData, 
                        address: {...editData.address, city: e.target.value}
                      })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={isEditing ? editData.address?.state : userDetails.address?.state || ''}
                      onChange={(e) => isEditing && setEditData({
                        ...editData, 
                        address: {...editData.address, state: e.target.value}
                      })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                    <input
                      type="text"
                      value={isEditing ? editData.address?.pincode : userDetails.address?.pincode || ''}
                      onChange={(e) => isEditing && setEditData({
                        ...editData, 
                        address: {...editData.address, pincode: e.target.value}
                      })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={isEditing ? editData.address?.country : userDetails.address?.country || 'India'}
                      onChange={(e) => isEditing && setEditData({
                        ...editData, 
                        address: {...editData.address, country: e.target.value}
                      })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="pt-4">
                <button 
                  onClick={handlePasswordChange}
                  disabled={passwordLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-6 rounded-lg font-medium transition-colors flex items-center"
                >
                  {passwordLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Two-Factor Authentication</h4>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">SMS Authentication</p>
                  <p className="text-sm text-gray-600">Receive codes via SMS</p>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Enable
                </button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Account Actions</h4>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-900">Delete Account</p>
                      <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                    </div>
                    <X className="w-5 h-5 text-red-500" />
                  </div>
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-orange-900">Logout from all devices</p>
                      <p className="text-sm text-orange-600">Sign out from all logged-in devices</p>
                    </div>
                    <LogOut className="w-5 h-5 text-orange-500" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;