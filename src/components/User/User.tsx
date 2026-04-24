import { useEffect, useState } from "react"
import { CiMail } from "react-icons/ci";
import { FaEdit, FaPhoneAlt, FaUserCircle } from "react-icons/fa";
import { IoCodeWorkingSharp } from "react-icons/io5";
import { MdCancel, MdOutlineVerified } from "react-icons/md";
import { SiExpertsexchange } from "react-icons/si";
import { useParams } from "react-router-dom";
import Activity from "./Activity";

type Education = {
  id?: number;
  courseName: string;
  specialization: string;
  collegeName: string;
  endingyear: number;
}

type Projects = {
  id?: number;
  projectName: string;
  description: string;
}

type Skills = {
  id?: number;
  skillName: string;
}

type User = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  role: string;
  experience: string;
  education: Education[];
  projects: Projects[];
  skills: Skills[];
}

// ── Shared input style ────────────────────────────────────────────
const inputCls = `
  w-full px-4 py-2.5 rounded-xl border border-[#e0e0da]
  bg-[#fafaf8] text-[#1a1a1a] text-sm
  focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a]
  transition placeholder:text-[#bbb]
`;

// ── Section wrapper ───────────────────────────────────────────────
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">{title}</h2>
        <div className="flex-1 h-px bg-[#e5e5e0]" />
      </div>
      {children}
    </div>
  );
}

// ── Form field ────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-[#999]">{label}</label>
      {children}
    </div>
  );
}

function Profile() {
  const [user, setUser] = useState<User>({
    email: "", firstName: "", lastName: "", phoneNumber: "",
    isActive: true, role: "FREELANCER", experience: "",
    education: [], projects: [], skills: []
  });

  const { id } = useParams();
  const token = localStorage.getItem("authToken");

  const fetchUser = async () => {
    try {
      const res = await fetch(`https://freebirds-backend-latest.onrender.com/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUser(data.data);
    } catch (err) { console.error(err); }
  }

  useEffect(() => { fetchUser(); }, []);

  const [view, setView] = useState<boolean>(true);
  const handleViewClick = () => setView(true);
  const handleActivityClick = () => setView(false);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const [subViewAndEdit, editSubViewAndEdit] = useState<boolean>(true);
  const handleSubViewAndEdit = () => editSubViewAndEdit(!subViewAndEdit);

  const [newEducation, setNewEducation] = useState<Education>({
    courseName: "", specialization: "", collegeName: "", endingyear: 2024
  });
  const [newSkills, setNewskills] = useState<Skills>({ skillName: "" });
  const [newProject, setNewProject] = useState<Projects>({ projectName: "", description: "" });

  const handleSubViewAndEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      education: [...(user.education || []), newEducation],
      skills: [...(user.skills || []), newSkills],
      projects: [...(user.projects || []), newProject]
    };
    const { createdAt, resumePath, ...cleanUser } = updatedUser as any;
    const formData = new FormData();
    formData.append("user", JSON.stringify(cleanUser));
    try {
      const res = await fetch(`https://freebirds-backend-latest.onrender.com/api/users/${id}/update`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error("Failed to update user");
      const updatedData = await res.json();
      setUser(updatedData.user);
    } catch (err) { console.error("Error updating user:", err); }
  };

  const [windowSize, setWindowSize] = useState<number>(window.innerWidth);
  useEffect(() => {
    const h = () => setWindowSize(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  });

  const experienceLabel = typeof user.experience === "string" && user.experience.trim() !== ""
    ? user.experience : "Fresher";

  // ── VIEW panel (read mode) ───────────────────────────────────────
  const ViewPanel = () => (
    <div className="flex flex-col gap-8">

      {/* Education */}
      <Section id="educations" title="Education">
        {user.education.length === 0
          ? <p className="text-xs text-[#bbb] italic">No education added yet.</p>
          : <div className="flex flex-wrap gap-3">
            {user.education.map((edu) => (
              <div key={edu.id} className="bg-white border border-[#e5e5e0] rounded-2xl p-4 text-sm flex flex-col gap-1 min-w-[200px] shadow-sm">
                <p className="font-semibold text-[#1a1a1a]">{edu.courseName}</p>
                <p className="text-xs text-[#666]">{edu.specialization}</p>
                <p className="text-xs text-[#999]">{edu.collegeName}</p>
                <span className="mt-1 text-[10px] font-semibold px-2 py-0.5 bg-[#f0efe9] text-[#555] rounded-full w-fit">
                  Class of {edu.endingyear}
                </span>
              </div>
            ))}
          </div>
        }
      </Section>

      {/* Skills */}
      <Section id="skills" title="Skills">
        {user.skills.length === 0
          ? <p className="text-xs text-[#bbb] italic">No skills added yet.</p>
          : <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-[#1a1a1a] text-white text-xs font-medium">
                {skill.skillName}
              </span>
            ))}
          </div>
        }
      </Section>

      {/* Experience */}
      <Section id="experience" title="Experience">
        <div className="bg-white border border-[#e5e5e0] rounded-2xl px-4 py-3 text-sm text-[#555] w-fit shadow-sm flex items-center gap-2">
          <SiExpertsexchange className="text-[#1a1a1a]" />
          {experienceLabel}
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects" title="Projects">
        {user.projects.length === 0
          ? <p className="text-xs text-[#bbb] italic">No projects added yet.</p>
          : <div className="flex flex-wrap gap-3">
            {user.projects.map((project) => (
              <div key={project.id} className="bg-white border border-[#e5e5e0] rounded-2xl p-4 text-sm flex flex-col gap-1 min-w-[220px] max-w-xs shadow-sm">
                <p className="font-semibold text-[#1a1a1a]">{project.projectName}</p>
                <p className="text-xs text-[#888] leading-relaxed">{project.description}</p>
              </div>
            ))}
          </div>
        }
      </Section>

      {/* Resume */}
      <Section id="resume" title="Resume">
        <p className="text-xs text-[#bbb] italic">No resume uploaded yet.</p>
      </Section>
    </div>
  );

  // ── EDIT panel ────────────────────────────────────────────────────
  const EditPanel = () => (
    <form onSubmit={handleSubViewAndEditSubmit} className="flex flex-col gap-6">

      {/* Basic */}
      <div className="bg-white border border-[#e5e5e0] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#999]">Basic Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name">
            <input type="text" placeholder="Harry" value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              className={inputCls} />
          </Field>
          <Field label="Last Name">
            <input type="text" placeholder="Potter" value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Education */}
      <div className="bg-white border border-[#e5e5e0] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#999]">Add Education</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Course">
            <input type="text" placeholder="B.Tech" value={newEducation.courseName}
              onChange={(e) => setNewEducation({ ...newEducation, courseName: e.target.value })}
              className={inputCls} />
          </Field>
          <Field label="Specialization">
            <input type="text" placeholder="CSE" value={newEducation.specialization}
              onChange={(e) => setNewEducation({ ...newEducation, specialization: e.target.value })}
              className={inputCls} />
          </Field>
          <Field label="College">
            <input type="text" placeholder="RVIT" value={newEducation.collegeName}
              onChange={(e) => setNewEducation({ ...newEducation, collegeName: e.target.value })}
              className={inputCls} />
          </Field>
          <Field label="Completion Year">
            <input type="number" placeholder="2026" value={newEducation.endingyear}
              onChange={(e) => setNewEducation({ ...newEducation, endingyear: Number(e.target.value) })}
              className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white border border-[#e5e5e0] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#999]">Add Skill</h3>
        <Field label="Skill Name">
          <input type="text" placeholder="e.g. React, Java, Figma" value={newSkills.skillName}
            onChange={(e) => setNewskills({ ...newSkills, skillName: e.target.value })}
            className={inputCls} />
        </Field>
      </div>

      {/* Experience */}
      <div className="bg-white border border-[#e5e5e0] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#999]">Experience</h3>
        <Field label="Experience">
          <input type="text" placeholder="Fresher / 2 years at Infosys" value={user.experience}
            onChange={(e) => setUser({ ...user, experience: e.target.value })}
            className={inputCls} />
        </Field>
      </div>

      {/* Project */}
      <div className="bg-white border border-[#e5e5e0] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#999]">Add Project</h3>
        <Field label="Project Name">
          <input type="text" placeholder="e.g. Todo App" value={newProject.projectName}
            onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })}
            className={inputCls} />
        </Field>
        <Field label="Description">
          <input type="text" placeholder="Built with React + Spring Boot" value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className={inputCls} />
        </Field>
      </div>

      <input
        type="submit"
        value="Save Changes"
        className="self-start px-8 py-2.5 rounded-xl text-sm font-medium bg-[#1a1a1a] text-white cursor-pointer hover:bg-[#333] active:scale-95 transition-all duration-150"
      />
    </form>
  );

  return (
    <div className="min-h-screen bg-[#f5f4f0] font-sans pt-24 pb-16">

      {/* ── NOT LOGGED IN ── */}
      {!id || id === "undefined" ? (
        <div className="flex flex-col justify-center items-center gap-6 h-[70vh] px-6">
          <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] flex items-center justify-center">
            <FaUserCircle className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a] text-center">
            Please log in to view your profile
          </h1>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-6 flex flex-col gap-6">

          {/* ── HERO CARD ── */}
          <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden relative">
            {/* subtle dot pattern */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div className="relative px-8 py-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">

              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <FaUserCircle className="text-white/70 text-5xl" />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-4 flex-1 text-center sm:text-left">
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    {user.firstName || "—"} {user.lastName}
                  </h1>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/60 uppercase tracking-wider">
                      {user.role}
                    </span>
                    {user.isActive && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                        <MdOutlineVerified className="text-sm" /> Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact row */}
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                  {user.phoneNumber && (
                    <span className="flex items-center gap-1.5 text-xs text-white/50">
                      <FaPhoneAlt className="text-white/30" /> {user.phoneNumber}
                    </span>
                  )}
                  {user.email && (
                    <span className="flex items-center gap-1.5 text-xs text-white/50">
                      <CiMail className="text-white/30 text-sm" /> {user.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    <IoCodeWorkingSharp className="text-white/30" /> {experienceLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── TAB BAR ── */}
          <div className="flex gap-1 bg-white border border-[#e5e5e0] rounded-2xl p-1.5 shadow-sm w-fit">
            <button
              onClick={handleViewClick}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${view ? 'bg-[#1a1a1a] text-white shadow-sm' : 'text-[#888] hover:text-[#1a1a1a]'}`}
            >
              View & Edit
            </button>
            <button
              onClick={handleActivityClick}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${!view ? 'bg-[#1a1a1a] text-white shadow-sm' : 'text-[#888] hover:text-[#1a1a1a]'}`}
            >
              Activity Insights
            </button>
          </div>

          {/* ── MAIN CONTENT ── */}
          {view ? (
            <div className={`flex gap-6 ${windowSize > 1280 ? 'flex-row items-start' : 'flex-col'}`}>

              {/* Quick Links sidebar */}
              <div className="flex-shrink-0 w-full xl:w-52 bg-white border border-[#e5e5e0] rounded-2xl p-5 shadow-sm xl:sticky xl:top-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#999] mb-3">Quick Links</p>
                <div className="flex xl:flex-col flex-wrap gap-1">
                  {["educations", "skills", "experience", "projects", "resume"].map((s) => (
                    <button
                      key={s}
                      onClick={() => scrollToSection(s)}
                      className="text-left px-3 py-1.5 rounded-lg text-sm text-[#666] hover:bg-[#f0efe9] hover:text-[#1a1a1a] transition-all duration-150 capitalize"
                    >
                      {s === "educations" ? "Education" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content panel */}
              <div className="flex-1 bg-white border border-[#e5e5e0] rounded-2xl p-7 shadow-sm">

                {/* Edit / Cancel toggle */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={handleSubViewAndEdit}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${subViewAndEdit
                      ? 'border border-[#e5e5e0] text-[#555] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                      : 'bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-100'}`}
                  >
                    {subViewAndEdit ? <><FaEdit /> Edit Profile</> : <><MdCancel /> Cancel</>}
                  </button>
                </div>

                {subViewAndEdit ? <ViewPanel /> : <EditPanel />}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#e5e5e0] rounded-2xl p-7 shadow-sm">
              <Activity role={user.role} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Profile