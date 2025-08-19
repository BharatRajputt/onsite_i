import { createSlice } from '@reduxjs/toolkit';

const transactionOptionsSlice = createSlice({
  name: 'transactionOptions',
  initialState: {
    // Transaction options that map to your field configurations
    options: [
      { 
        id: 'PAYMENT_IN', 
        name: 'Payment In', 
        description: 'Money received from parties',
        icon: 'TrendingUp',
        color: 'green'
      },
      { 
        id: 'PAYMENT_OUT', 
        name: 'Payment Out', 
        description: 'Money paid to parties',
        icon: 'TrendingDown',
        color: 'red'
      },
      { 
        id: 'DEBIT_NOTE', 
        name: 'Debit Note', 
        description: 'Debit note issued to party',
        icon: 'FileText',
        color: 'orange'
      },
      { 
        id: 'CREDIT_NOTE', 
        name: 'Credit Note', 
        description: 'Credit note issued to party',
        icon: 'FileText',
        color: 'blue'
      },
      { 
        id: 'PARTY_TO_PARTY', 
        name: 'Party to Party', 
        description: 'Transfer between parties',
        icon: 'ArrowRightLeft',
        color: 'purple'
      },
      { 
        id: 'SALES_INVOICE', 
        name: 'Sales Invoice', 
        description: 'Invoice for sales',
        icon: 'Receipt',
        color: 'green'
      }
    ],
    
    // Current selected option
    selectedOption: null,
    
    // Modal state
    isModalOpen: false,
    step: 'closed' // 'closed', 'option-selector', 'form'
  },
  
  reducers: {
    // Open transaction modal
    openModal: (state) => {
      state.isModalOpen = true;
      state.step = 'option-selector';
      state.selectedOption = null; // Reset selection
    },
    
    // Close modal and reset state
    closeModal: (state) => {
      state.isModalOpen = false;
      state.step = 'closed';
      state.selectedOption = null;
    },
    
    // Select option and go to form
    selectOption: (state, action) => {
      const optionId = action.payload;
      state.selectedOption = state.options.find(opt => opt.id === optionId);
      state.step = 'form';
    },
    
    // Go back to option selector
    goBackToOptions: (state) => {
      state.step = 'option-selector';
      state.selectedOption = null;
    },
    
    // Add new option
    addOption: (state, action) => {
      state.options.push(action.payload);
    },
    
    // Remove option
    removeOption: (state, action) => {
      state.options = state.options.filter(opt => opt.id !== action.payload);
    },
    
    // Set selected option directly (useful for editing)
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    }
  }
});

export const {
  openModal,
  closeModal,
  selectOption,
  goBackToOptions,
  addOption,
  removeOption,
  setSelectedOption
} = transactionOptionsSlice.actions;

export default transactionOptionsSlice.reducer;