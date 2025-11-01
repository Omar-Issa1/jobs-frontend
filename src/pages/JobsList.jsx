import React, { useEffect, useState } from "react";
import API from "../services/api";
import JobCard from "../components/JobCard";
import { Link } from "react-router-dom";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sortStatus, setSortStatus] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  async function fetchJobs() {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/jobs");
      setJobs(res.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await API.delete(`/jobs/${id}`);
      setJobs((s) => s.filter((j) => j._id !== id));
    } catch (err) {
      alert(err.response?.data?.msg || err.message);
    }
  }

  const filtered = jobs.filter(
    (j) =>
      j.company.toLowerCase().includes(query.toLowerCase()) ||
      j.position.toLowerCase().includes(query.toLowerCase())
  );

  const sorted = [...filtered];

  if (sortStatus !== "none") {
    const statusPriorityMap = (statusToPrioritize) => (status) =>
      status === statusToPrioritize ? 0 : 1;

    if (sortStatus === "declinedFirst") {
      sorted.sort(
        (a, b) =>
          statusPriorityMap("declined")(a.status) -
          statusPriorityMap("declined")(b.status)
      );
    } else if (sortStatus === "pendingFirst") {
      sorted.sort(
        (a, b) =>
          statusPriorityMap("pending")(a.status) -
          statusPriorityMap("pending")(b.status)
      );
    } else if (sortStatus === "interviewFirst") {
      sorted.sort(
        (a, b) =>
          statusPriorityMap("interview")(a.status) -
          statusPriorityMap("interview")(b.status)
      );
    }
  }

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = sorted.slice(startIndex, endIndex);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl">Jobs ({sorted.length})</h1>
        <div className="flex gap-2">
          <input
            placeholder="Search by company or position"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-2 bg-slate-800 rounded"
          />

          <select
            value={sortStatus}
            onChange={(e) => setSortStatus(e.target.value)}
            className="p-2 bg-slate-800 rounded text-gray-100"
          >
            <option value="none">Sort by Status (None)</option>
            <option value="declinedFirst">Show Declined First</option>
            <option value="pendingFirst">Show Pending First</option>
            <option value="interviewFirst">Show Interview First</option>
          </select>

          <Link to="/add" className="px-3 py-2 bg-green-600 rounded">
            New Job
          </Link>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="bg-red-600 p-3 rounded">{error}</div>
      ) : (
        <>
          <div className="grid gap-4">
            {paginatedJobs.length === 0 && (
              <div className="p-4 bg-slate-800 rounded">No jobs found</div>
            )}
            {paginatedJobs.map((job) => (
              <JobCard key={job._id} job={job} onDelete={handleDelete} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-slate-700 rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      page === currentPage ? "bg-indigo-600" : "bg-slate-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-slate-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
