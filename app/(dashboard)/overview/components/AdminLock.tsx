"use client";

import { useState } from "react";

interface AdminLockProps {
  children: React.ReactNode;
}

export default function AdminLock({ children }: AdminLockProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock admin password: "admin"
    if (password === "kasim1234") {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  if (isUnlocked) {
    return (
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Admin Overview</h2>
          <button
            onClick={() => setIsUnlocked(false)}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Lock Section
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm mb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200" />
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm text-3xl">
        🔒
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">Admin Overview Locked</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-sm">
          This section contains sensitive sales and revenue data. Please enter the admin password to view.
        </p>
      </div>

      <form onSubmit={handleUnlock} className="w-full max-w-xs mt-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full px-4 py-2 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-center mb-2"
        />
        {error && <p className="text-red-500 text-xs mt-1 mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm"
        >
          Unlock Data
        </button>
      </form>
    </div>
  );
}
