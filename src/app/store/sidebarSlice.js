import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  activeItem: 'dashboard',
  menuItems: [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
    { id: 'add member', label: 'Add Member', icon: 'UserPlus', path: '/members' },
    { id: 'projects', label: 'Projects', icon: 'FolderOpen', path: '/projects' },
    { id: 'timesheet', label: 'Timesheet', icon: 'Clock', path: '/timesheet' },
    { id: 'mom', label: 'MOM', icon: 'Calendar', path: '/mom' },
    { id: 'todo', label: 'TODO', icon: 'CheckCircle', path: '/todo' },
    { id: 'crm', label: 'Crm', icon: 'HousePlus', path: '/crm' },
    { id: 'reports', label: 'Reports', icon: 'BarChart3', path: '/reports' },
    { id: 'chat-group', label: 'Chat Groups', icon: 'MessageCircle', path: '/chat' },
    { id: 'payroll', label: 'Payroll', icon: 'IdCard', path: '/payroll' },
    { id: 'settings', label: 'Settings', icon: 'Settings', path: '/settings' },
    { id: 'user-profile', label: 'User', icon: 'User', path: '/user-profile' }

  ]
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    setActiveItem: (state, action) => {
      state.activeItem = action.payload;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
    }
  }
});

export const { toggleSidebar, setActiveItem, closeSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;