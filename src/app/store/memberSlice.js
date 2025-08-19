import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  members: [
    {
      id: 1,
      partyName: 'John Doe',
      phone: '+91 9876543210',
      email: 'john.doe@example.com',
      partyType: 'Client',
      openingBalance: 50000,
      bankAccount: 'SBI-123456789',
      address: '123 Main Street, Mumbai',
      partyId: 'PID-1',
      aadhaar: '1234-5678-9012',
      pan: 'ABCDE1234F',
      password: 'password123',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      partyName: 'ABC Materials Ltd',
      phone: '+91 9876543211',
      email: 'info@abcmaterials.com',
      partyType: 'Material Supplier',
      openingBalance: 25000,
      bankAccount: 'HDFC-987654321',
      address: '456 Industrial Area, Delhi',
      partyId: 'PID-2',
      aadhaar: '',
      pan: 'XYZAB5678C',
      password: 'supplier123',
      createdAt: new Date().toISOString()
    }
  ],
  loading: false,
  error: null
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    // Add new member
    addMember: (state, action) => {
      const newMember = {
        id: Date.now(),
        ...action.payload,
        partyId: `PID-${Date.now().toString().slice(-6)}`, // Generate unique ID
        createdAt: new Date().toISOString()
      };
      state.members.unshift(newMember);
    },

    // Update member
    updateMember: (state, action) => {
      const { id, updates } = action.payload;
      const memberIndex = state.members.findIndex(member => member.id === id);
      if (memberIndex !== -1) {
        state.members[memberIndex] = { ...state.members[memberIndex], ...updates };
      }
    },

    // Delete member
    deleteMember: (state, action) => {
      state.members = state.members.filter(member => member.id !== action.payload);
    },

    // Update opening balance
    updateOpeningBalance: (state, action) => {
      const { id, balance } = action.payload;
      const memberIndex = state.members.findIndex(member => member.id === id);
      if (memberIndex !== -1) {
        state.members[memberIndex].openingBalance = balance;
      }
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    }
  }
});

// Export actions
export const {
  addMember,
  updateMember,
  deleteMember,
  updateOpeningBalance,
  setLoading,
  setError,
  clearError
} = membersSlice.actions;

// Selectors
export const selectAllMembers = (state) => state.members.members;
export const selectMemberById = (state, memberId) => 
  state.members.members.find(member => member.id === memberId);
export const selectMembersByType = (state, partyType) => 
  state.members.members.filter(member => member.partyType === partyType);
export const selectMembersLoading = (state) => state.members.loading;
export const selectMembersError = (state) => state.members.error;

// Export reducer
export default membersSlice.reducer;