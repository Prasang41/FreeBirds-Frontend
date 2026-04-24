import axios from 'axios'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { FaRProject, FaUserCircle } from 'react-icons/fa'
import { GoProject } from 'react-icons/go'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import AOS from 'aos';
import 'aos/dist/aos.css'

const API_URL = import.meta.env.VITE_API_URL;

type Job = {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
}

function Home() {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const { id } = useParams<{ id: string | undefined }>();
  const token = localStorage.getItem("authToken");

  const fetchUser = async () => {
    if (!id || id === "undefined") {
      console.log("No ID found");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFirstName(data.data.firstName);
      setLastName(data.data.lastName);
    } catch (err) { console.error(err); }
  }

  useEffect(() => { fetchUser(); }, []);

  const handleCompleteProfile = () => { window.location.href = `/user/${id}`; }
  const handleProjectDetails = () => { window.location.href = `/user/${id}`; }

  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/jobs`, {  // ✅ Fixed: backticks
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data.jobs ?? []);  // ✅ Fixed: fallback to empty array
    } catch (err) { console.error(err); }
  }

  useEffect(() => { fetchJobs(); }, []);

  const firstLine = "FIND YOUR"
  const firstLineWords = firstLine.split("");
  const secondLine = "FUTURE"
  const secondLineWords = secondLine.split("");
  const thirdLine = "CONNECTING TALENT WITH RIGHT OPPORTUNITY"
  const thirdLineWords = thirdLine.split("");

  const firstContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 1, when: "beforeChildren", staggerChildren: 0.2 } },
  };
  const secondContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 3, when: "beforeChildren", staggerChildren: 0.3 } },
  };
  const thirdContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 5, when: "beforeChildren", staggerChildren: 0.1 } },
  };
  const wordVariant = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

  const [windowSize, setWindowSize] = useState<number>(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  useEffect(() => { AOS.init({ duration: 3000 }); }, []);

  const navigate = useNavigate();
  const { jobId } = useParams();
  const [openJob, setOpenJob] = useState<boolean>(false);

  const handleJob = (jobId: string) => { navigate(`job/${jobId}`); };

  useEffect(() => {
    if (jobId) setOpenJob(true);
    else setOpenJob(false);
  }, [jobId]);

  const JobCard = ({ job, mobile = false }: { job: Job; mobile?: boolean }) => (
    <div
      data-aos="fade-up"
      onClick={() => handleJob(job.id)}
      className={`
        group bg-white border border-[#e5e5e0] rounded-2xl p-6 flex flex-col gap-4
        shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200
        ${mobile ? 'flex-shrink-0 w-64 snap-start' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-[#f0efe9] flex items-center justify-center group-hover:bg-[#1a1a1a] transition-colors duration-200">
          <FaRProject className="text-[#1a1a1a] group-hover:text-white text-lg transition-colors duration-200" />
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${job.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
          {job.status}
        </span>
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-[#1a1a1a] text-base leading-snug">{job.title}</h3>
        <p className="text-xs text-[#999] leading-relaxed line-clamp-2">{job.description}</p>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-[#f0efe9]">
        <span className="text-sm font-medium text-[#1a1a1a]">
          ₹{job.budget.toLocaleString()}
          <span className="text-xs text-[#bbb] font-normal ml-1">budget</span>
        </span>
        <span className="text-xs text-[#bbb] group-hover:text-[#1a1a1a] group-hover:translate-x-0.5 transition-all duration-150">View →</span>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f5f4f0] overflow-x-hidden font-sans pt-24">

      {/* 🌐 PUBLIC ABOUT SECTION */}
      <div className="bg-[#1a1a1a] px-6 py-16">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Welcome to FreeBirds
          </h1>
          <p className="max-w-2xl text-sm text-white/50 leading-relaxed">
            FreeBirds is a modern job and project platform where talent meets opportunity.
            You can explore jobs, build real-world projects, and connect with the right people.
            Whether you are a student or a professional, this platform helps you grow your career.
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            <span className="px-3 py-1 rounded-full text-xs font-medium border border-white/15 text-white/50">Jobs</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium border border-white/15 text-white/50">Projects</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium border border-white/15 text-white/50">Freelancing</span>
          </div>
        </div>
      </div>

      {/* ── NOT LOGGED IN ── */}
      {!id || id === "undefined" ? (

        <div className="flex flex-col">

          <div className="flex flex-col justify-center items-center gap-4 py-14 px-6 border-b border-[#e5e5e0]">
            <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] flex items-center justify-center">
              <FaUserCircle className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] tracking-tight text-center">
              Log in to see your personalised feed
            </h2>
            <p className="text-sm text-[#999] max-w-xs text-center leading-relaxed">
              Sign in to access job listings, your profile, and project dashboard.
            </p>
          </div>

          <div className="max-w-5xl mx-auto w-full px-6 py-16 flex flex-col gap-14">

            <div className="flex flex-col gap-6">
              <div data-aos="fade-up" className="flex items-baseline gap-4">
                <h2 className="text-3xl font-bold text-[#1a1a1a] tracking-tight">Explore Popular Jobs</h2>
                <span className="text-sm text-[#999]">{jobs.length} listings</span>
              </div>
              <div className={windowSize > 768
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                : "flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 snap-x snap-mandatory"
              }>
                {jobs.map(job => <JobCard key={job.id} job={job} mobile={windowSize <= 768} />)}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div data-aos="fade-up" className="flex items-baseline gap-4">
                <h2 className="text-3xl font-bold text-[#1a1a1a] tracking-tight">Recommended Jobs</h2>
              </div>
              <div className={windowSize > 768
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                : "flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 snap-x snap-mandatory"
              }>
                {jobs.map(job => <JobCard key={job.id} job={job} mobile={windowSize <= 768} />)}
              </div>
            </div>
          </div>
        </div>

      ) : (
        openJob ? (
          <div className='pt-30 p-5 h-[100vh]'>
            <Outlet />
          </div>
        ) : (
          <div className='flex flex-col gap-10'>

            {/* ── HERO BANNER ── */}
            <div className="relative h-[100vh] overflow-hidden bg-[#0e0e0e]">
              {windowSize > 800
                ? <img src="../Banner.png" alt="Banner Image" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                : <img src="../mobile-banner.png" alt="Banner Image" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              }
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

              <div className="relative w-[90vw] h-[100vh] flex flex-col justify-center items-end ml-auto">
                <motion.h1
                  variants={firstContainer} initial="hidden" animate="visible"
                  className='text-4xl xl:text-8xl lg:text-7xl md:text-6xl sm:text-5xl font-bold text-white/90 tracking-tight drop-shadow'
                >
                  {firstLineWords.map((word, i) => (
                    <motion.span key={i} variants={wordVariant}>{word === " " ? "\u00A0" : word}</motion.span>
                  ))}
                </motion.h1>

                <motion.h1
                  variants={secondContainer} initial="hidden" animate="visible"
                  className='text-7xl xl:text-[10rem] lg:text-9xl md:text-8xl sm:text-7xl font-extrabold leading-none'
                  style={{ WebkitTextStroke: "2px rgba(255,255,255,0.85)", color: "transparent", letterSpacing: "-0.02em" }}
                >
                  {secondLineWords.map((word, i) => (
                    <motion.span key={i} variants={wordVariant}>{word === " " ? "\u00A0" : word}</motion.span>
                  ))}
                </motion.h1>

                <motion.h1
                  variants={thirdContainer} initial="hidden" animate="visible"
                  className='mt-5 text-xs sm:text-sm tracking-[0.2em] uppercase text-white/40'
                >
                  {thirdLineWords.map((word, i) => (
                    <motion.span key={i} variants={wordVariant}>{word === " " ? "\u00A0" : word}</motion.span>
                  ))}
                </motion.h1>
              </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            {windowSize > 1280 ? (

              /* DESKTOP */
              <div className="flex gap-0 bg-[#f5f4f0]">

                <div data-aos="fade-right" className="w-72 flex-shrink-0 p-8 border-r border-[#e5e5e0] flex flex-col gap-6 sticky top-0 h-fit">
                  <div className="w-20 h-20 rounded-2xl bg-[#1a1a1a] flex items-center justify-center mx-auto">
                    <FaUserCircle className="text-white text-4xl" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-[#1a1a1a] tracking-tight">{firstName} {lastName}</h2>
                    <p className="text-xs text-[#999] mt-0.5">B.Tech</p>
                    <p className="text-xs text-[#999]">RV Institute of Technology</p>
                  </div>
                  <div className="h-px bg-[#e5e5e0]" />
                  <button
                    onClick={handleCompleteProfile}
                    className="w-full py-2.5 rounded-xl text-sm font-medium bg-[#1a1a1a] text-white hover:bg-[#333] active:scale-95 transition-all duration-150"
                  >
                    Complete Profile
                  </button>
                </div>

                <div className="flex-1 px-10 py-12 flex flex-col gap-16">
                  <section className="flex flex-col gap-6">
                    <div data-aos="fade-up" className="flex items-baseline gap-4">
                      <h2 className="text-4xl font-bold text-[#1a1a1a] tracking-tight">Explore Popular Jobs</h2>
                      <span className="text-sm text-[#999]">{jobs.length} listings</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                      {jobs.map(job => <JobCard key={job.id} job={job} />)}
                    </div>
                  </section>

                  <section className="flex flex-col gap-6">
                    <div data-aos="fade-up" className="flex items-baseline gap-4">
                      <h2 className="text-4xl font-bold text-[#1a1a1a] tracking-tight">Recommended Jobs</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                      {jobs.map(job => <JobCard key={job.id} job={job} />)}
                    </div>
                  </section>
                </div>

                <div data-aos="fade-left" className="w-72 flex-shrink-0 p-8 border-l border-[#e5e5e0] flex flex-col gap-6 sticky top-0 h-fit">
                  <div className="w-20 h-20 rounded-2xl bg-[#f0efe9] flex items-center justify-center mx-auto">
                    <GoProject className="text-[#1a1a1a] text-4xl" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Project</h2>
                    <p className="text-xs text-[#999] mt-0.5">Stack</p>
                    <p className="text-xs text-[#999]">Description</p>
                  </div>
                  <div className="h-px bg-[#e5e5e0]" />
                  <button
                    onClick={handleProjectDetails}
                    className="w-full py-2.5 rounded-xl text-sm font-medium border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white active:scale-95 transition-all duration-150"
                  >
                    Check Project Details
                  </button>
                </div>
              </div>

            ) : (

              /* MOBILE */
              <div className="flex flex-col gap-10 pb-16 bg-[#f5f4f0]">

                <div data-aos="fade-up" className="mx-6 mt-2 bg-white border border-[#e5e5e0] rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] flex items-center justify-center">
                    <FaUserCircle className="text-white text-3xl" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-[#1a1a1a]">{firstName} {lastName}</h2>
                    <p className="text-xs text-[#999]">B.Tech · RV Institute of Technology</p>
                  </div>
                  <button
                    onClick={handleCompleteProfile}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium bg-[#1a1a1a] text-white hover:bg-[#333] active:scale-95 transition-all duration-150"
                  >
                    Complete Profile
                  </button>
                </div>

                <section className="px-6 flex flex-col gap-5">
                  <div data-aos="fade-up" className="flex items-baseline gap-3">
                    <h2 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">Explore Popular Jobs</h2>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 snap-x snap-mandatory">
                    {jobs.map(job => <JobCard key={job.id} job={job} mobile />)}
                  </div>
                </section>

                <section className="px-6 flex flex-col gap-5">
                  <div data-aos="fade-up" className="flex items-baseline gap-3">
                    <h2 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">Recommended Jobs</h2>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 snap-x snap-mandatory">
                    {jobs.map(job => <JobCard key={job.id} job={job} mobile />)}
                  </div>
                </section>

                <div data-aos="fade-up" className="mx-6 bg-white border border-[#e5e5e0] rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-[#f0efe9] flex items-center justify-center">
                    <GoProject className="text-[#1a1a1a] text-3xl" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Project</h2>
                    <p className="text-xs text-[#999]">Stack · Description</p>
                  </div>
                  <button
                    onClick={handleProjectDetails}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white active:scale-95 transition-all duration-150"
                  >
                    Check Project Details
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  )
}

export default Home