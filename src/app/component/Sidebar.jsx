import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation.js';
import { toggleSidebar, setActiveItem, closeSidebar } from '../store/sidebarSlice.js';
import { setHeaderTitle } from "../store/headerSlice.js"
import * as Icons from 'lucide-react';

const Sidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen, activeItem, menuItems } = useSelector((state) => state.sidebar);

  const handleMenuClick = (item) => {
  dispatch(setActiveItem(item.id));
  dispatch(setHeaderTitle(item.label)); // ✅ Header title update
  router.push(item.path);

  if (window.innerWidth < 768) {
    dispatch(closeSidebar());
  }
};

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => dispatch(closeSidebar())}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-purple-900 to-indigo-900 
        text-white transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = Icons[item.icon] || Icons.Circle;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-colors duration-200
                      ${activeItem === item.id 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <IconComponent size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
