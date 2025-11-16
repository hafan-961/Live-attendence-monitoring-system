import React from "react";

function Sidebar({ setPage }) {
  return (
    <div className="w-64 h-screen bg-white shadow-lg p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-8">AI Attendance</h2>

      <ul className="space-y-4 text-gray-700 font-medium">
        <li 
          className="cursor-pointer hover:text-blue-600"
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </li>

        <li 
          className="cursor-pointer hover:text-blue-600"
          onClick={() => setPage("attendance")}
        >
          Attendance Records
        </li>

        <li 
          className="cursor-pointer hover:text-blue-600"
          onClick={() => setPage("register")}
        >
          Register Student
        </li>

        <li 
          className="cursor-pointer hover:text-blue-600"
          onClick={() => setPage("live")}
        >
          Live Attendance
        </li>



        <li 
          className="cursor-pointer hover:text-blue-600"
          onClick={() => setPage("students")}
        >
          Students List
        </li>

        <li 
          className="cursor-pointer hover:text-blue-600"
          onClick={() => setPage("settings")}
        >
          Settings
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
