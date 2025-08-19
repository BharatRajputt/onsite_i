import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "Dashboard",
  notificationCount: 0
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setHeaderTitle: (state, action) => {
      state.title = action.payload;
    },
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    }
  }
});

export const { setHeaderTitle, setNotificationCount } = headerSlice.actions;
export default headerSlice.reducer;
