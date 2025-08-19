"use client"
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../store/sidebarSlice.js';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

const Layout = ({ children,showHeader=true}) => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.sidebar);
    const { title } = useSelector((state) => state.header);


  return (
    <div className="flex h-screen bg-purple-100">
      <Sidebar />
      
      <div className="flex-1 md:ml-64">
        {/* Header */}
        {showHeader && <Header title={title}/>}

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;