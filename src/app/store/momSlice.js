import { createSlice } from '@reduxjs/toolkit'

const momSlice = createSlice({
    name: 'moms',
    initialState: {
        moms: [], // Fixed: was 'mom' should be 'moms' to match the name
        loading: false,
        error: null
    },
    reducers: { // Fixed: was 'reducer' should be 'reducers'
        addMom: (state, action) => {
            const newMom = {
                id: Date.now().toString(),
                ...action.payload,
                createdAt: new Date().toISOString()
            };
            state.moms.push(newMom); // Fixed: now matches the state property name
        },
        updateMom: (state, action) => {
            const { id, ...updates } = action.payload;
            const existingMom = state.moms.find(mom => mom.id === id);
            if (existingMom) {
                Object.assign(existingMom, updates, {
                    updatedAt: new Date().toISOString()
                });
            }
        },
        deleteMom: (state, action) => {
            state.moms = state.moms.filter(mom => mom.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        // Additional useful actions
        toggleMomPin: (state, action) => {
            const mom = state.moms.find(m => m.id === action.payload);
            if (mom) {
                mom.pinned = !mom.pinned;
            }
        },
        duplicateMom: (state, action) => {
            const originalMom = state.moms.find(m => m.id === action.payload);
            if (originalMom) {
                const duplicatedMom = {
                    ...originalMom,
                    id: Date.now().toString(),
                    meetingName: `${originalMom.meetingName} (Copy)`,
                    createdAt: new Date().toISOString(),
                    pinned: false
                };
                state.moms.push(duplicatedMom);
            }
        }
    }
});

export const { 
    addMom, 
    updateMom, 
    deleteMom, 
    setLoading, 
    setError, 
    clearError,
    toggleMomPin,
    duplicateMom
} = momSlice.actions;

export default momSlice.reducer; // Fixed: was 'addMom.reducer' should be 'momSlice.reducer'

// Selectors
export const selectAllMoms = (state) => state.moms.moms;
export const selectMomById = (state, momId) => state.moms.moms.find(mom => mom.id === momId);
export const selectMomsLoading = (state) => state.moms.loading;
export const selectMomsError = (state) => state.moms.error;
export const selectPinnedMoms = (state) => state.moms.moms.filter(mom => mom.pinned);