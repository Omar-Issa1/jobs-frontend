import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function JobForm() {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [status, setStatus] = useState("pending");
  const [customStatus, setCustomStatus] = useState("");

  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    async function fetchJob() {
      if (!isEdit) return;

      try {
        setLoadingData(true);
        const response = await API.get(`/jobs/${id}`);
        const job = response.data.job;

        setCompany(job.company);
        setPosition(job.position);
        setLocation(job.location);
        setExpectedSalary(job.expectedSalary || "");

        if (["pending", "interview", "declined"].includes(job.status)) {
          setStatus(job.status);
          setCustomStatus("");
        } else {
          setStatus("custom");
          setCustomStatus(job.status || "");
        }
      } catch (error) {
        setError(error.response?.data?.msg || error.message);
      } finally {
        setLoadingData(false);
      }
    }

    fetchJob();
  }, [id, isEdit]);

  function handleStatusChange(e) {
    const val = e.target.value;
    setStatus(val);
    if (val !== "custom") {
      setCustomStatus("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!company.trim() || !position.trim() || !location.trim()) {
        throw new Error("Company, Position, and Location are required.");
      }

      const finalStatus = status === "custom" ? customStatus.trim() : status;
      if (status === "custom" && finalStatus.length === 0) {
        throw new Error("Please enter a custom status.");
      }

      const salaryValue =
        expectedSalary === "" || expectedSalary === "unspecified"
          ? "unspecified"
          : Number(expectedSalary);

      if (salaryValue !== "unspecified" && isNaN(salaryValue)) {
        throw new Error("Expected salary must be a number or 'unspecified'.");
      }

      const body = {
        company: company.trim(),
        position: position.trim(),
        location: location.trim(),
        expectedSalary: salaryValue,
        status: finalStatus,
      };

      if (isEdit) {
        await API.patch(`/jobs/${id}`, body);
      } else {
        await API.post("/jobs", body);
      }

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-slate-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl mb-4">{isEdit ? "Edit Job" : "Add Job"}</h2>

      {error && <div className="bg-red-600 p-2 rounded mb-3">{error}</div>}

      {loadingData ? (
        <div>Loading job data...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-2 bg-slate-800 rounded"
            required
          />
          <input
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full p-2 bg-slate-800 rounded"
            required
          />
          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 bg-slate-800 rounded"
            required
          />
          <input
            placeholder="Expected salary (optional)"
            value={expectedSalary}
            onChange={(e) => setExpectedSalary(e.target.value)}
            className="w-full p-2 bg-slate-800 rounded"
          />

          <div className="space-y-1">
            <label
              htmlFor="status-select"
              className="block text-gray-300 font-medium"
            >
              Status
            </label>
            <select
              id="status-select"
              value={status}
              onChange={handleStatusChange}
              className="w-full p-2 bg-slate-800 rounded"
              required
            >
              <option value="pending">🕓 Pending</option>
              <option value="interview">💼 Interview</option>
              <option value="declined">❌ Declined</option>
              <option value="custom">✨ Custom</option>
            </select>

            {status === "custom" && (
              <input
                type="text"
                placeholder="Enter custom status"
                value={customStatus}
                onChange={(e) => setCustomStatus(e.target.value)}
                className="w-full p-2 mt-1 bg-slate-800 rounded"
                required
                autoFocus
              />
            )}
          </div>

          <div className="flex gap-2">
            <button
              disabled={submitting}
              className="px-3 py-2 bg-indigo-600 rounded"
            >
              {submitting ? "Please wait..." : isEdit ? "Save" : "Create"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-3 py-2 bg-slate-700 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
