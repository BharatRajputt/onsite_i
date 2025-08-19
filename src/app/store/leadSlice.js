import { createSlice } from '@reduxjs/toolkit';

const leadSlice = createSlice({
  name: 'leads',
  initialState: {
    leads: [
      // Sample initial data
      {
        id: 1,
        sno: 1,
        leadType: 'Premium Client',
        contactName: 'Sagar Gupta',
        contactNumber: '8629960466',
        email: 'sagar@email.com',
        companyName: 'ABC Corp',
        status: 'New',
        source: 'Instagram',
        category: 'Hot Lead',
        leadAssignee: 'Sagar',
        assigneeAvatar: 'S',
        priority: 'High',
        budget: '50000',
        lastContactedDate: '2024-08-15',
        followUpDate: '2024-08-20',
        expectedClosureDate: '2024-09-15',
        address: 'Mumbai, Maharashtra',
        description: 'Interested in premium services',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    currentLead: null, // For edit mode
    filters: {
      search: '',
      assignee: '',
      status: '',
      priority: '',
      source: '',
      category: ''
    },
    sorting: {
      field: 'createdAt',
      direction: 'desc'
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0
    },
    isLoading: false,
    error: null,
    isEditMode: false
  },

  reducers: {
    // CREATE - Add new lead
    addLead: (state, action) => {
      const newLead = {
        ...action.payload,
        id: Date.now() + Math.random(), // Unique ID
        sno: state.leads.length + 1,
        assigneeAvatar: action.payload.leadAssignee?.charAt(0).toUpperCase() || 'N',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log(newLead)
   console.log(state.leads.unshift(newLead))// Add to beginning
      state.pagination.totalItems = state.leads.length;
    },

    // READ - Set leads (from API)
    setLeads: (state, action) => {
      state.leads = action.payload.map((lead, index) => ({
        ...lead,
        sno: index + 1,
        assigneeAvatar: lead.leadAssignee?.charAt(0).toUpperCase() || 'N'
      }));
      state.pagination.totalItems = state.leads.length;
    },

    // UPDATE - Update existing lead
    updateLead: (state, action) => {
      const { id, ...updates } = action.payload;
      console.log(updates)
      console.log(action)
      const leadIndex = state.leads.findIndex(lead => lead.id === id);
      
      if (leadIndex !== -1) {
        state.leads[leadIndex] = {
          ...state.leads[leadIndex],
          ...updates,
          assigneeAvatar: updates.leadAssignee?.charAt(0).toUpperCase() || state.leads[leadIndex].assigneeAvatar,
          updatedAt: new Date().toISOString()
        };
      }
      
      state.currentLead = null;
      state.isEditMode = false;
    },

    // DELETE - Remove lead
    deleteLead: (state, action) => {
      const leadId = action.payload;
      state.leads = state.leads.filter(lead => lead.id !== leadId);
      
      // Update serial numbers
      state.leads = state.leads.map((lead, index) => ({
        ...lead,
        sno: index + 1
      }));
      
      state.pagination.totalItems = state.leads.length;
    },

    // BULK DELETE - Delete multiple leads
    bulkDeleteLeads: (state, action) => {
      const leadIds = action.payload;
      state.leads = state.leads.filter(lead => !leadIds.includes(lead.id));
      
      // Update serial numbers
      state.leads = state.leads.map((lead, index) => ({
        ...lead,
        sno: index + 1
      }));
      
      state.pagination.totalItems = state.leads.length;
    },

    // DUPLICATE - Duplicate a lead
    duplicateLead: (state, action) => {
      const leadId = action.payload;
      const originalLead = state.leads.find(lead => lead.id === leadId);
      
      if (originalLead) {
        const duplicatedLead = {
          ...originalLead,
          id: Date.now() + Math.random(),
          sno: state.leads.length + 1,
          contactName: `${originalLead.contactName} (Copy)`,
          email: originalLead.email ? `copy_${originalLead.email}` : '',
          status: 'New',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        state.leads.unshift(duplicatedLead);
        state.pagination.totalItems = state.leads.length;
      }
    },

    // EDIT MODE - Set lead for editing
    setEditLead: (state, action) => {
      const leadId = action.payload;
      const lead = state.leads.find(l => l.id === leadId);
      
      if (lead) {
        state.currentLead = { ...lead };
        state.isEditMode = true;
      }
    },

    // CANCEL EDIT - Cancel edit mode
    cancelEdit: (state) => {
      state.currentLead = null;
      state.isEditMode = false;
    },

    // FILTERS - Update filters
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = {
        search: '',
        assignee: '',
        status: '',
        priority: '',
        source: '',
        category: ''
      };
    },

    // SORTING - Update sorting
    updateSorting: (state, action) => {
      const { field, direction } = action.payload;
      state.sorting = { field, direction };
      
      // Apply sorting
      state.leads.sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];
        
        // Handle different data types
        if (field === 'budget') {
          aValue = parseFloat(aValue || 0);
          bValue = parseFloat(bValue || 0);
        } else if (field.includes('Date')) {
          aValue = new Date(aValue || 0);
          bValue = new Date(bValue || 0);
        }
        
        if (direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    },

    // PAGINATION - Update pagination
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // LOADING & ERROR STATES
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // BULK OPERATIONS
    updateLeadStatus: (state, action) => {
      const { leadIds, status } = action.payload;
      state.leads = state.leads.map(lead => {
        if (leadIds.includes(lead.id)) {
          return {
            ...lead,
            status,
            updatedAt: new Date().toISOString()
          };
        }
        return lead;
      });
    },

    assignLeadsToUser: (state, action) => {
      const { leadIds, assignee } = action.payload;
      state.leads = state.leads.map(lead => {
        if (leadIds.includes(lead.id)) {
          return {
            ...lead,
            leadAssignee: assignee,
            assigneeAvatar: assignee.charAt(0).toUpperCase(),
            updatedAt: new Date().toISOString()
          };
        }
        return lead;
      });
    },

    // IMPORT/EXPORT
    importLeads: (state, action) => {
      const importedLeads = action.payload.map((lead, index) => ({
        ...lead,
        id: Date.now() + Math.random() + index,
        sno: state.leads.length + index + 1,
        assigneeAvatar: lead.leadAssignee?.charAt(0).toUpperCase() || 'N',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      
      state.leads.push(...importedLeads);
      state.pagination.totalItems = state.leads.length;
    }
  }
});

// Export actions
export const {
  addLead,
  setLeads,
  updateLead,
  deleteLead,
  bulkDeleteLeads,
  duplicateLead,
  setEditLead,
  cancelEdit,
  updateFilters,
  clearFilters,
  updateSorting,
  updatePagination,
  setLoading,
  setError,
  clearError,
  updateLeadStatus,
  assignLeadsToUser,
  importLeads
} = leadSlice.actions;

// Selectors
export const selectAllLeads = (state) => state.leads.leads;
export const selectCurrentLead = (state) => state.leads.currentLead;
export const selectIsEditMode = (state) => state.leads.isEditMode;
export const selectFilters = (state) => state.leads.filters;
export const selectSorting = (state) => state.leads.sorting;
export const selectPagination = (state) => state.leads.pagination;
export const selectIsLoading = (state) => state.leads.isLoading;
export const selectError = (state) => state.leads.error;

// Complex selectors
export const selectFilteredLeads = (state) => {
  const { leads, filters, sorting } = state.leads;
  
  let filteredLeads = leads.filter(lead => {
    const matchesSearch = !filters.search || 
      Object.values(lead).some(value => 
        value && value.toString().toLowerCase().includes(filters.search.toLowerCase())
      );
    
    const matchesAssignee = !filters.assignee || lead.leadAssignee === filters.assignee;
    const matchesStatus = !filters.status || lead.status === filters.status;
    const matchesPriority = !filters.priority || lead.priority === filters.priority;
    const matchesSource = !filters.source || lead.source === filters.source;
    const matchesCategory = !filters.category || lead.category === filters.category;
    
    return matchesSearch && matchesAssignee && matchesStatus && 
           matchesPriority && matchesSource && matchesCategory;
  });
  
  return filteredLeads;
};

export const selectLeadStats = (state) => {
  const leads = state.leads.leads;
  
  return {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    qualified: leads.filter(l => l.status === 'Qualified').length,
    converted: leads.filter(l => l.status === 'Closed Won').length,
    highPriority: leads.filter(l => l.priority === 'High').length,
    totalBudget: leads.reduce((sum, l) => sum + parseFloat(l.budget || 0), 0)
  };
};

export default leadSlice.reducer;