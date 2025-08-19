"use client"
import React from 'react';
import { X, Plus } from 'lucide-react';

const MembersTab = ({ 
  members = [], // Use passed members prop instead of Redux
  newMemberName, 
  setNewMemberName, 
  handleAddMember, 
  handleRemoveMember 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-100">
        <label className="block text-sm font-semibold text-gray-700 mb-4">ADD NEW TEAM MEMBER</label>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white"
            placeholder="Enter team member name"
            onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
          />
          <button
            onClick={handleAddMember}
            disabled={!newMemberName.trim()}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
          >
            <Plus size={18} />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <span>Team Members</span>
          <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
            {members.length}
          </span>
        </h3>

        {members.map((member) => (
          <div key={member.id} className="group bg-white border-2 border-gray-100 hover:border-purple-200 rounded-2xl p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {member.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-lg">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.phone || 'No phone number'}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-medium">
                  {member.role}
                </span>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {members.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-gray-400" />
            </div>
            <p>No team members added yet</p>
            <p className="text-sm">Add team members to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersTab;