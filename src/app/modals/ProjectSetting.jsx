"use client"
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ProjectDetails from '../component/tabs/ProjectDetailsTab';
import Members from '../component/tabs/MemberTab';
import ClientDetails from '../component/tabs/ClientDetailsTab';
import { addParty, deleteParty } from '../store/partySlice'
import { useDispatch } from 'react-redux';
import { addProject } from '../store/projectSlice';
import { useAddProjectMutation, useGetMembersQuery } from '../store/api'

const ProjectSetting = ({ onClose, initialData = {} }) => {
  console.log(initialData);
  const [activeTab, setActiveTab] = useState('Project Details');
  const { data: fetchedMembers, error: memberError, isLoading: membersLoading } = useGetMembersQuery();
  const [projectData, setProjectData] = useState({
    // Project details
    projectName: initialData.projectName || '',
    projectCode: '',
    startDate: '',
    endDate: '',
    projectAddress: initialData.address || '',
    projectCity: initialData.city || '',
    attendanceRadius: '500',
    projectValue: '0',
    projectOrientation: '',
    projectDimension: '',
    
    // Client details
    clientName: '',
    clientMobile: '',
    clientCompanyName: '',
    companyAddress: '',
    companyGstNumber: '',
    
    // Additional fields that will be auto-generated
    createdAt: new Date().toISOString(),
    expense: 0,
    id: Date.now(),
    income: 0,
    isPinned: false,
    location: "undefined, undefined", // You might want to get actual location
    progress: 0,
    status: "Active",
    todo: 0
  });

  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]); // Add selected members state
  const [newMemberName, setNewMemberName] = useState('');
  const [clientImage, setClientImage] = useState(null);
  const [clientImagePreview, setClientImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // Hide body scroll when modal opens
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    if (fetchedMembers && Array.isArray(fetchedMembers.data)) {
      setMembers(fetchedMembers.data.map(member => ({
        ...member,
        avatar: member.name?.charAt(0).toUpperCase() || 'U',
      })));
    }
  }, [fetchedMembers]);
  
  const [addProjectQuery] = useAddProjectMutation();

  // Token management functions
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const isAuthenticated = () => {
    return !!getAuthToken();
  };

  const handleInputChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const newMember = {
        id: Date.now(),
        name: newMemberName,
        phone: '',
        role: 'Staff',
        avatar: newMemberName.charAt(0).toUpperCase()
      };
      setMembers(prev => [...prev, newMember]);
      setNewMemberName('');
    }
  };

  const handleRemoveMember = (memberId) => {
    setMembers(prev => prev.filter(member => member.id !== memberId));
    // Also remove from selected members if it was selected
    setSelectedMembers(prev => prev.filter(member => member.id !== memberId));
  };

  // New functions for member selection
  const handleSelectMember = (member) => {
    if (!selectedMembers.some(selected => selected.id === member.id)) {
      setSelectedMembers(prev => [...prev, member]);
    }
  };

  const handleUnselectMember = (memberId) => {
    setSelectedMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setClientImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setClientImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setClientImage(null);
    setClientImagePreview(null);
  };

  const handleSave = async () => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        alert('Please login first to save the project.');
        return;
      }

      setIsLoading(true);

      // Validation
      const requiredFields = ['projectName'];
      const missingFields = requiredFields.filter(field => !projectData[field].trim());
      
      if (missingFields.length > 0) {
        alert('Please fill in all required fields: ' + missingFields.join(', '));
        setIsLoading(false);
        return;
      }

      // Create the complete project object with all expected fields
      const completeProjectData = {
        ...projectData,
        // Update timestamp when saving
        createdAt: projectData.createdAt || new Date().toISOString(),
        // Ensure all fields are present even if empty
        clientCompanyName: projectData.clientCompanyName || "",
        clientMobile: projectData.clientMobile || "",
        clientName: projectData.clientName || "",
        companyAddress: projectData.companyAddress || "",
        companyGstNumber: projectData.companyGstNumber || "",
        endDate: projectData.endDate || "",
        projectCode: projectData.projectCode || "",
        projectDimension: projectData.projectDimension || "",
        projectOrientation: projectData.projectOrientation || "",
        startDate: projectData.startDate || "",
        // Add selected members to the project data
        selectedMembers: selectedMembers, // This will be sent to backend
        members: members // Keep all members for local state
      };

      console.log('Complete project data:', completeProjectData);
      console.log('Selected members for project:', selectedMembers);
      console.log('Auth headers:', getAuthHeaders());

      // Add to Redux store first (local state)
      dispatch(addProject(completeProjectData));

      // Send to backend with authentication token
      const response = await addProjectQuery(completeProjectData).unwrap();
      
      console.log('Project saved successfully:', response);
      
      // Show success message with member count
      const memberMessage = selectedMembers.length > 0 
        ? ` with ${selectedMembers.length} team member${selectedMembers.length > 1 ? 's' : ''}` 
        : '';
      alert(`Project saved successfully${memberMessage}!`);
      
      onClose?.();
    } catch (error) {
      console.error('Error saving project:', error.message);
      
      // Handle different types of errors
      if (error?.status === 401) {
        alert('Authentication failed. Please login again.');
        // Optionally redirect to login page
        // window.location.href = '/login';
      } else if (error?.status === 403) {
        alert('You do not have permission to create projects.');
      } else if (error?.data?.message) {
        alert('Error: ' + error.data.message);
      } else {
        alert('Failed to save project. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      console.log('Deleting project');
      onClose?.();
    }
  };

  const tabs = ['Project Details', 'Members', 'Client Details'];
  const renderContent = () => {
    switch (activeTab) {
      case 'Project Details':
        return (
          <ProjectDetails
            projectData={projectData}
            handleInputChange={handleInputChange}
          />
        );
      case 'Members':
        return (
          <Members
            projectData={projectData}
            members={members}
            selectedMembers={selectedMembers} // Pass selected members
            newMemberName={newMemberName}
            setNewMemberName={setNewMemberName}
            handleAddMember={handleAddMember}
            handleRemoveMember={handleRemoveMember}
            handleSelectMember={handleSelectMember} // Pass select function
            handleUnselectMember={handleUnselectMember} // Pass unselect function
          />
        );
      case 'Client Details':
        return (
          <ClientDetails
            projectData={projectData}
            handleInputChange={handleInputChange}
            clientImage={clientImage}
            clientImagePreview={clientImagePreview}
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[96vh] overflow-hidden border border-gray-200/50 animate-in slide-in-from-bottom-4 duration-500">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-white to-purple-50/30">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Project Settings</h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure your project details and team
              {selectedMembers.length > 0 && (
                <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="group p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
          >
            <X size={20} className="text-gray-500 group-hover:text-gray-700 transition-colors" />
          </button>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-8 py-4 text-sm font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? 'text-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              {tab}
              {/* Show selected members count in Members tab */}
              {tab === 'Members' && selectedMembers.length > 0 && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  {selectedMembers.length}
                </span>
              )}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"></div>
              )}
              {index < tabs.length - 1 && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-6 bg-gray-200"></div>
              )}
            </button>
          ))}
        </div>

        {/* Enhanced Content */}
        <div className="p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-gray-100 max-h-[calc(90vh-250px)]">
          <div className="animate-in slide-in-from-right-4 duration-300">
            {renderContent()}
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="flex items-center justify-between p-8 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-purple-50/30">
          <button
            onClick={handleDeleteProject}
            className="group px-6 py-3 text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-semibold flex items-center space-x-2"
            disabled={isLoading}
          >
            <span>Delete Project</span>
          </button>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-[1.02] ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <span className="relative z-10 flex items-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>
                    Save Project
                    {selectedMembers.length > 0 && (
                      <span className="ml-2 bg-purple-800 px-2 py-1 rounded text-xs">
                        +{selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSetting;