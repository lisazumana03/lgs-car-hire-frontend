import React from 'react';
import SidebarData from './SidebarData.jsx';

function Sidebar() {
  // Get current path to highlight active item
  const currentPath = window.location.pathname;

  return (
    <div className="sidebar">
      <h2>LG'S CAR HIRE</h2>
      <ul className="sidebar-menu">
        {SidebarData.map((item, index) => {
          const isActive = currentPath === item.path;
          const IconComponent = item.icon;
          return (
            <li key={index}>
              <a 
                href={item.path} 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span className="icon">
                  <IconComponent />
                </span>
                <span className="title">{item.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;