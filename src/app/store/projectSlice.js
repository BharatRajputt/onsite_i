import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [
   
  ],
  pinnedProjects: [],
  loading: false,
  error: null
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Add new project
    addProject: (state, action) => {
      const newProject = {
        id: Date.now(), // Simple ID generation
        ...action.payload,
        progress: 0,
        todo: 0,
        income: 0,
        expense: 0,
        status: 'Active',
        createdAt: new Date().toISOString(),
        isPinned: false,
        location: `${action.payload.address}, ${action.payload.city}` // Combine address and city
      };
      console.log(newProject)
      state.projects.unshift(newProject); // Add to beginning of array
    },

    // Update project
    updateProject: (state, action) => {
      const { id, updates } = action.payload;
      const projectIndex = state.projects.findIndex(project => project.id === id);
      if (projectIndex !== -1) {
        state.projects[projectIndex] = { ...state.projects[projectIndex], ...updates };
      }
    },

    // Delete project
    deleteProject: (state, action) => {
      state.projects = state.projects.filter(project => project.id !== action.payload);
      // Also remove from pinned if it was pinned
      state.pinnedProjects = state.pinnedProjects.filter(id => id !== action.payload);
    },

    // Duplicate project
    duplicateProject: (state, action) => {
      const originalProject = state.projects.find(project => project.id === action.payload);
      if (originalProject) {
        const duplicatedProject = {
          ...originalProject,
          id: Date.now(),
          name: `${originalProject.name} (Copy)`,
          createdAt: new Date().toISOString(),
          isPinned: false
        };
        state.projects.unshift(duplicatedProject);
      }
    },

    // Toggle pin project
    togglePinProject: (state, action) => {
      const projectId = action.payload;
      const projectIndex = state.projects.findIndex(project => project.id === projectId);
      
      if (projectIndex !== -1) {
        // Toggle isPinned in project
        state.projects[projectIndex].isPinned = !state.projects[projectIndex].isPinned;
        
        // Update pinnedProjects array
        if (state.pinnedProjects.includes(projectId)) {
          state.pinnedProjects = state.pinnedProjects.filter(id => id !== projectId);
        } else {
          state.pinnedProjects.push(projectId);
        }
      }
    },

    // Update project progress
    updateProjectProgress: (state, action) => {
      const { id, progress } = action.payload;
      const projectIndex = state.projects.findIndex(project => project.id === id);
      if (projectIndex !== -1) {
        state.projects[projectIndex].progress = progress;
      }
    },

    // Update project financials
    updateProjectFinancials: (state, action) => {
      const { id, income, expense } = action.payload;
      const projectIndex = state.projects.findIndex(project => project.id === id);
      if (projectIndex !== -1) {
        if (income !== undefined) state.projects[projectIndex].income = income;
        if (expense !== undefined) state.projects[projectIndex].expense = expense;
      }
    },

    // Update todo count
    updateProjectTodo: (state, action) => {
      const { id, todo } = action.payload;
      const projectIndex = state.projects.findIndex(project => project.id === id);
      if (projectIndex !== -1) {
        state.projects[projectIndex].todo = todo;
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
  addProject,
  updateProject,
  deleteProject,
  duplicateProject,
  togglePinProject,
  updateProjectProgress,
  updateProjectFinancials,
  updateProjectTodo,
  setLoading,
  setError,
  clearError
} = projectsSlice.actions;

// Selectors
export const selectAllProjects = (state) => state.projects.projects;
export const selectPinnedProjects = (state) => state.projects.pinnedProjects;
export const selectProjectById = (state, projectId) => 
  state.projects.projects.find(project => project.id === projectId);
export const selectActiveProjects = (state) => 
  state.projects.projects.filter(project => project.status === 'Active');
export const selectProjectsLoading = (state) => state.projects.loading;
export const selectProjectsError = (state) => state.projects.error;

// Export reducer
export default projectsSlice.reducer;