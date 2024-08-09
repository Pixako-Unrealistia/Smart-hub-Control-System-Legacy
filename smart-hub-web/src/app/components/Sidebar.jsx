import React from 'react';
import Link from 'next/link';

const Sidebar = ({ isVisible, toggleSidebar }) => {
  return (
    <>
      {isVisible && (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white transition-all duration-300">
          <div className="relative p-5">
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 bg-gray-700 p-2 rounded-md"
            >
              Close
            </button>
            <h2 className="text-2xl font-bold mt-10">Dashboard</h2>
            <nav className="mt-5">
              <ul>
                <li className="mt-3">
                  <Link href="/dashboard">
                    <span className="block p-2 hover:bg-gray-700 rounded">Dashboard</span>
                  </Link>
                </li>
                <li className="mt-3">
                  <Link href="/profile">
                    <span className="block p-2 hover:bg-gray-700 rounded">Profile</span>
                  </Link>
                </li>
                <li className="mt-3">
                  <Link href="/settings">
                    <span className="block p-2 hover:bg-gray-700 rounded">Settings</span>
                  </Link>
                </li>
                {/* Add more links as needed */}
              </ul>
            </nav>
          </div>
        </aside>
      )}
      {!isVisible && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 bg-gray-700 p-2 rounded-md z-50"
        >
          Open
        </button>
      )}
    </>
  );
};

export default Sidebar;
