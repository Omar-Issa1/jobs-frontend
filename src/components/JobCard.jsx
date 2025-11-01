import React from "react";
import { Link } from "react-router-dom";

const statusColors = {
  pending: "bg-yellow-500",
  interview: "bg-blue-500",
  declined: "bg-red-500",
  custom: "bg-purple-500",
};

export default function JobCard({ job, onDelete }) {
  const statusKey = ["pending", "interview", "declined"].includes(job.status)
    ? job.status
    : "custom";

  return (
    <div className="p-4 bg-slate-800 rounded flex justify-between items-center">
      <div>
        <div className="font-bold text-lg text-gray-100">{job.position}</div>
        <div className="text-sm text-slate-300">
          {job.company} • {job.location}
        </div>
        <div className="text-sm text-slate-400">
          Expected salary: {job.expectedSalary}
        </div>
        <div
          className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded text-white ${statusColors[statusKey]}`}
          title={`Status: ${job.status}`}
        >
          {job.status}
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          to={`/edit/${job._id}`}
          className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-700 transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(job._id)}
          className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
