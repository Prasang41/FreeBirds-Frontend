import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaRProject } from 'react-icons/fa'
import { MdDelete, MdEdit } from 'react-icons/md';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

type JobStatus = 'OPEN' | 'COMPLETED';

type Job = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  budget: number;
  status: JobStatus;
  clientId: number
}

function Jobs() {

  // Jobs Section Fetching from backend 

  const { id } = useParams();

  const token = localStorage.getItem("authToken");

  const [jobs, setJobs] = useState<Job[]>([]);


  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setJobs(res.data.jobs);
      console.log(res.data.jobs);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  // User Checking t0 Freelancer or Client

  const [role, setRole] = useState<string>('');

  const user = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRole(res.data.data.role);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    user();
  }, []);



  // Creating a Jobs Section

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [budget, setBudget] = useState<number>(0);


  const creatingJob = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/jobs`, {
        title: title,
        description: description,
        budget: budget,
        deadline: deadline,
        status: "OPEN",
        clientId: Number(id)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Creating", res);
      fetchJobs();
    } catch (err) {
      console.error("Not Creating", err);
    }
  }

  // handle Create Job button click

  const [creatingSection, setCreatingSection] = useState<boolean>(false);
  const handleCreateJob = () => {
    setCreatingSection(!creatingSection);
  }

  // Job Creating Form Submit
  const jobCreating = (e: React.FormEvent) => {
    e.preventDefault();
    creatingJob();
    setCreatingSection(false);
  }

  // showing Job for created by user

  const [clientsJob, setClientsJob] = useState<Job[]>([]);

  const clientsCreatedjob = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/jobs/client/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setClientsJob(res.data.jobs);
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    clientsCreatedjob();
  }, [])

  // Handle Delete

  const handleDelete = async (jobId: string) => {
    try {
      await axios.delete(`${API_URL}/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error(err);
    }
  };


  // handle Edit

  const handleEdit = async (jobId: string) => {
    try {
      await axios.put(`${API_URL}/api/jobs/${jobId}`, {
        status: status === "OPEN" ? "CLOSED" : "OPEN"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Job Navigation 

  const navigate = useNavigate();
const { jobId } = useParams(); 

const [openJob, setOpenJob] = useState<boolean>(false);

const handleJob = (jobId: string) => {
  navigate(`job/${jobId}`);
};

useEffect(() => {
  if (jobId) {
    setOpenJob(true); 
  } else {
    setOpenJob(false); 
  }
}, [jobId]);




  return (
    <div className="min-h-screen bg-[#f5f4f0] font-sans pt-24 px-8 pb-16">
 
      {/* ── NOT LOGGED IN ── */}
      {!id || id === "undefined" ? (
        <div className="flex flex-col justify-center items-center gap-6 h-[75vh]">
          <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] flex items-center justify-center">
            <FaRProject className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1a1a1a]">
            Please log in to view jobs
          </h1>
          <p className="text-sm text-[#888] max-w-xs text-center leading-relaxed">
            You need to be authenticated to browse or manage job listings.
          </p>
        </div>
 
      ) : role === 'CLIENT' ? (
 
        /* ── CLIENT VIEW ── */
        <div className="max-w-5xl mx-auto">
 
          {/* Header row */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">My Jobs</h1>
              <p className="text-sm text-[#888] mt-1">Manage your active listings</p>
            </div>
            <button
              onClick={handleCreateJob}
              className="
                flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                bg-[#1a1a1a] text-white
                hover:bg-[#333] active:scale-95
                transition-all duration-150 shadow-sm
              "
            >
              {creatingSection ? '✕ Cancel' : '+ New Job'}
            </button>
          </div>
 
          {/* Create Job Form */}
          {creatingSection && (
            <div className="
              mb-12 bg-white border border-[#e5e5e0] rounded-2xl shadow-sm
              overflow-hidden
            ">
              <div className="px-8 py-5 border-b border-[#e5e5e0] bg-[#fafaf8]">
                <h2 className="text-lg font-semibold text-[#1a1a1a]">Create a New Job</h2>
                <p className="text-xs text-[#999] mt-0.5">
                  Fill in the details below to publish a new listing.
                </p>
              </div>
 
              <form onSubmit={jobCreating} className="px-8 py-7 flex flex-col gap-5">
 
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#888]">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior React Developer"
                    onChange={(e) => setTitle(e.target.value)}
                    className="
                      w-full px-4 py-2.5 rounded-xl border border-[#e0e0da]
                      bg-[#fafaf8] text-[#1a1a1a] text-sm
                      focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a]
                      transition
                    "
                  />
                </div>
 
                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#888]">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the role and responsibilities…"
                    onChange={(e) => setDescription(e.target.value)}
                    className="
                      w-full px-4 py-2.5 rounded-xl border border-[#e0e0da]
                      bg-[#fafaf8] text-[#1a1a1a] text-sm resize-none
                      focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a]
                      transition
                    "
                  />
                </div>
 
                {/* Budget & Deadline row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-[#888]">
                      Budget (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="
                        w-full px-4 py-2.5 rounded-xl border border-[#e0e0da]
                        bg-[#fafaf8] text-[#1a1a1a] text-sm
                        focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a]
                        transition
                      "
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-[#888]">
                      Deadline
                    </label>
                    <input
                      type="datetime-local"
                      onChange={(e) => {
                        const raw = e.target.value;
                        const withSeconds = raw.length === 16 ? raw + ":00" : raw;
                        setDeadline(withSeconds);
                      }}
                      className="
                        w-full px-4 py-2.5 rounded-xl border border-[#e0e0da]
                        bg-[#fafaf8] text-[#1a1a1a] text-sm
                        focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a]
                        transition
                      "
                    />
                  </div>
                </div>
 
                <div className="pt-2">
                  <input
                    type="submit"
                    value="Publish Job"
                    className="
                      px-7 py-2.5 rounded-xl text-sm font-medium
                      bg-[#1a1a1a] text-white cursor-pointer
                      hover:bg-[#333] active:scale-95
                      transition-all duration-150
                    "
                  />
                </div>
              </form>
            </div>
          )}
 
          {/* Client Job Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientsJob.map((job: Job) => (
              <div
                key={job.id}
                className="
                  group bg-white border border-[#e5e5e0] rounded-2xl p-6
                  flex flex-col gap-4 shadow-sm
                  hover:shadow-md hover:-translate-y-0.5
                  transition-all duration-200
                "
              >
                {/* Icon + status badge */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#f0efe9] flex items-center justify-center">
                    <FaRProject className="text-[#1a1a1a] text-lg" />
                  </div>
                  <span className={`
                    text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider
                    ${job.status === 'OPEN'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-gray-100 text-gray-500'}
                  `}>
                    {job.status}
                  </span>
                </div>
 
                {/* Content */}
                <div className="flex flex-col gap-1 flex-1">
                  <h2 className="font-semibold text-[#1a1a1a] text-base leading-snug">
                    {job.title}
                  </h2>
                  <p className="text-xs text-[#999] leading-relaxed line-clamp-2">
                    {job.description}
                  </p>
                </div>
 
                {/* Budget */}
                <div className="text-sm font-medium text-[#1a1a1a]">
                  ₹{job.budget.toLocaleString()}
                  <span className="text-xs text-[#bbb] font-normal ml-1">budget</span>
                </div>
 
                {/* Actions */}
                <div className="flex gap-3 pt-1 border-t border-[#f0efe9]">
                  <button
                    onClick={() => handleEdit(job.id)}
                    className="
                      flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
                      bg-[#f0efe9] text-[#444]
                      hover:bg-[#e5e4de] active:scale-95
                      transition-all duration-150
                    "
                  >
                    <MdEdit className="text-base" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="
                      flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
                      bg-rose-50 text-rose-500
                      hover:bg-rose-100 active:scale-95
                      transition-all duration-150
                    "
                  >
                    <MdDelete className="text-base" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
 
      ) : (
 
        /* ── FREELANCER VIEW ── */
        <div>
          {openJob ? (
            <Outlet />
          ) : (
            <div className="max-w-5xl mx-auto">
 
              {/* Header */}
              <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-[#1a1a1a]">
                  Browse Jobs
                </h1>
                <p className="text-sm text-[#888] mt-2">
                  Find your next opportunity
                </p>
              </div>
 
              {/* Job Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job: Job) => (
                  <button
                    key={job.id}
                    onClick={() => handleJob(job.id)}
                    className="
                      group text-left bg-white border border-[#e5e5e0] rounded-2xl p-6
                      flex flex-col gap-4 shadow-sm cursor-pointer
                      hover:shadow-lg hover:-translate-y-1 hover:border-[#1a1a1a]/20
                      transition-all duration-200
                    "
                  >
                    {/* Icon + status */}
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#f0efe9] flex items-center justify-center group-hover:bg-[#1a1a1a] transition-colors duration-200">
                        <FaRProject className="text-[#1a1a1a] group-hover:text-white text-lg transition-colors duration-200" />
                      </div>
                      <span className={`
                        text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider
                        ${job.status === 'OPEN'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-gray-100 text-gray-500'}
                      `}>
                        {job.status}
                      </span>
                    </div>
 
                    {/* Content */}
                    <div className="flex flex-col gap-1 flex-1">
                      <h2 className="font-semibold text-[#1a1a1a] text-base leading-snug">
                        {job.title}
                      </h2>
                      <p className="text-xs text-[#999] leading-relaxed line-clamp-2">
                        {job.description}
                      </p>
                    </div>
 
                    {/* Budget + arrow */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#f0efe9]">
                      <div className="text-sm font-medium text-[#1a1a1a]">
                        ₹{job.budget.toLocaleString()}
                        <span className="text-xs text-[#bbb] font-normal ml-1">budget</span>
                      </div>
                      <span className="text-xs text-[#bbb] group-hover:text-[#1a1a1a] group-hover:translate-x-0.5 transition-all duration-150">
                        View →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Jobs