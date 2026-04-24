import axios from 'axios';
import { useEffect, useState } from 'react'
import { FaRProject } from 'react-icons/fa';
import { MdOutlineTimer, MdOutlineAttachMoney, MdOutlineVerified } from 'react-icons/md';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

type JobDetails = {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: string;
  clientId: string;
}

function Job() {
  const { id } = useParams();
  const { jobId } = useParams();
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const [jobDetails, setJobDetails] = useState<JobDetails>({
    title: '', description: '', budget: 0,
    deadline: '', status: '', clientId: ''
  });

  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const job = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/jobs/${jobId}`, {
        headers: { Authorization: `bearer ${token}` }
      });
      setJobDetails(res.data.job);
    } catch (err) { console.error("Error", err); }
  }

  useEffect(() => { if (jobId) job() }, [jobId]);

  const isOpen = jobDetails.status === "OPEN";

  const handleApply = async () => {
    if (!isOpen || applied) return;
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/proposals`, {
        bidAmount: jobDetails.budget,
        coverLetter: "SKILLS: REACT",
        status: "PENDING",
        freelancerId: id,
        jobId: jobId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplied(true);
      alert("Applied Successfully");
    } catch {
      alert("Applied Failed");
    } finally {
      setLoading(false);
    }
  }

  // Format deadline nicely
  const formatDeadline = (raw: string) => {
    if (!raw) return "—";
    try {
      return new Date(raw).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
      });
    } catch { return raw; }
  };

  return (
    <div className="min-h-screen bg-[#f5f4f0] font-sans px-6 py-10 pt-28">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-[#999] hover:text-[#1a1a1a] transition-colors duration-150 w-fit"
        >
          <HiOutlineArrowLeft className="text-sm" /> Back to Jobs
        </button>

        {/* ── Hero card ── */}
        <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="relative px-8 py-10 flex flex-col sm:flex-row items-start gap-7">

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <FaRProject className="text-white/70 text-3xl" />
            </div>

            {/* Title + description */}
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                  {jobDetails.title || "Loading…"}
                </h1>
                <span className={`flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${isOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                  {isOpen && <MdOutlineVerified className="text-sm" />}
                  {jobDetails.status || "—"}
                </span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                {jobDetails.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>

        {/* ── Details row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Budget */}
          <div className="bg-white border border-[#e5e5e0] rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-[#f0efe9] flex items-center justify-center">
              <MdOutlineAttachMoney className="text-[#1a1a1a] text-lg" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#999]">Budget</p>
            <p className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
              ₹{jobDetails.budget ? jobDetails.budget.toLocaleString() : "0"}
            </p>
          </div>

          {/* Deadline */}
          <div className="bg-white border border-[#e5e5e0] rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-[#f0efe9] flex items-center justify-center">
              <MdOutlineTimer className="text-[#1a1a1a] text-lg" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#999]">Deadline</p>
            <p className="text-lg font-semibold text-[#1a1a1a]">
              {formatDeadline(jobDetails.deadline)}
            </p>
          </div>

          {/* Client ID */}
          <div className="bg-white border border-[#e5e5e0] rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-[#f0efe9] flex items-center justify-center">
              <FaRProject className="text-[#1a1a1a] text-base" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#999]">Client ID</p>
            <p className="text-lg font-semibold text-[#1a1a1a] truncate">
              {jobDetails.clientId || "—"}
            </p>
          </div>
        </div>

        {/* ── Apply section ── */}
        <div className="bg-white border border-[#e5e5e0] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-[#1a1a1a]">
              {applied ? "Application Submitted" : isOpen ? "Ready to Apply?" : "This Job is Closed"}
            </h2>
            <p className="text-xs text-[#999] mt-0.5 leading-relaxed">
              {applied
                ? "Your proposal has been sent. The client will review it shortly."
                : isOpen
                ? "Submit your proposal and connect with the client directly."
                : "This listing is no longer accepting applications."}
            </p>
          </div>

          <button
            onClick={handleApply}
            disabled={!isOpen || applied || loading}
            className={`
              flex-shrink-0 px-7 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-150 active:scale-95
              ${applied
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default'
                : isOpen
                ? 'bg-[#1a1a1a] text-white hover:bg-[#333] cursor-pointer'
                : 'bg-[#f0efe9] text-[#bbb] cursor-not-allowed'}
            `}
          >
            {loading ? "Applying…" : applied ? "✓ Applied" : isOpen ? "Apply Now" : "Closed"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Job