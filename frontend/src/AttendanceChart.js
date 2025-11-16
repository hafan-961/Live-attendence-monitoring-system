import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AttendanceChart({ attendance }) {
  const presentCount = attendance.filter((a) => a.Status === "Present").length;
  const absentCount = attendance.filter((a) => a.Status === "Absent").length;

  const data = [
    { name: "Present", value: presentCount },
    { name: "Absent", value: absentCount },
  ];

  return (
    <div className="bg-white p-6 shadow rounded-lg mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Attendance Summary
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AttendanceChart;
