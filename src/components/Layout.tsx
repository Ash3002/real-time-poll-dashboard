import Link from "next/link";
import React from "react";
import { useAuth } from "../context/AuthContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            Real-Time Poll
          </Link>
          <nav>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link href="/login" className="text-sm hover:underline">
                  Login
                </Link>
                <Link href="/register" className="text-sm hover:underline">
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-3xl mx-auto p-4">{children}</main>
      <footer className="text-center py-4 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Real-Time Poll
      </footer>
    </div>
  );
};

export default Layout; 