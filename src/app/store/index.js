import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './sidebarSlice';
import projectReducer from './projectSlice'
import headerReducer  from './headerSlice.js'
import memberReducer from './memberSlice'
import partyReducer from './partySlice'
import todoReducer from './todoSlice'
import timeSheetReducer from './timeSlice'
import leadReducer from './leadSlice'
import transactionOptions from "./transactionOptionSlice"
import transactionFields from "./transactionField"

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    projects:projectReducer,
    header:headerReducer,
    members:memberReducer,
    party:partyReducer,
    todo:todoReducer,
    timesheet:timeSheetReducer,
    leads:leadReducer,
    transactionOptions: transactionOptions,
    transactionFields: transactionFields,
  },
});