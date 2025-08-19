import { createSlice } from '@reduxjs/toolkit';

const partySlice = createSlice({
  name: 'party',
  initialState: {
    parties: [],
    loading: false,
    error: null
  },
  reducers: {
    addParty: (state, action) => {
        console.log(state,action)
      const newParty = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString()
      };
      state.parties.push(newParty);
      console.log(newParty)
    },
    updateParty: (state, action) => {
      const index = state.parties.findIndex(party => party.id === action.payload.id);
      if (index !== -1) {
        state.parties[index] = { ...state.parties[index], ...action.payload };
      }
    },
    deleteParty: (state, action) => {
      state.parties = state.parties.filter(party => party.id !== action.payload);
    }
  }
});

export const { addParty, updateParty, deleteParty, } = partySlice.actions;
export default partySlice.reducer;
