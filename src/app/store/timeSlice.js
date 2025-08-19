import { createSlice } from '@reduxjs/toolkit';

const timesheetSlice = createSlice({
  name: 'timesheet',
  initialState: {
    timesheets: [],
    loading: false,
    error: null
  },
  reducers: {
    addTimesheet: (state, action) => {
      const newTimesheet = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString()
      };
      state.timesheets.push(newTimesheet);
    },
    updateTimesheet: (state, action) => {
      const index = state.timesheets.findIndex(sheet => sheet.id === action.payload.id);
      if (index !== -1) {
        state.timesheets[index] = { ...state.timesheets[index], ...action.payload };
      }
    },
    deleteTimesheet: (state, action) => {
      state.timesheets = state.timesheets.filter(sheet => sheet.id !== action.payload);
    }
  }
});

export const { addTimesheet, updateTimesheet, deleteTimesheet } = timesheetSlice.actions;
export default timesheetSlice.reducer;