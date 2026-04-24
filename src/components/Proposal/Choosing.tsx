import { useEffect, useState } from "react";
import { FaMailBulk, FaPhone, FaRProject } from "react-icons/fa";
import { useParams } from "react-router-dom"

type Proposal = {
  id: number;
  bidAmount: number;
  coverLetter: string;
  status: string;
  jobId: string;
  freelancerId: string;
}

type Skill = {
  id: number;
  skillName: string;
}

type Project = {
  id: number;
  projectName: string;
  description: string;
}

type Education = {
  id: number;
  endingyear: number;
  courseName: string;
  specialization: string;
  collegeName: string;
}

type User = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  experience: string;
  skills: Skill[];
  projects: Project[];
  education: Education[];
}

type Job = {
  id: number;
  budget: number;
  clientId: number;
  deadline: string;
  description: string;
  status: string;
  title: string;
}

function Choosing() {

  const { proposalId } = useParams();
  const token = localStorage.getItem("authToken")


  // Fetching the Proposal Data

  const [proposal, setProposal] = useState<Proposal>({
    id: 0,
    bidAmount: 0,
    coverLetter: "",
    status: "",
    jobId: "",
    freelancerId: ""
  });


  const FetchProposalData = async () => {
    try {
      const res = await fetch(`https://freebirds-backend-latest.onrender.com/api/proposals/${proposalId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json();
      setProposal(data.proposal);
      FetchUserDetails(data.proposal.freelancerId)
      FetchJobDetails(data.proposal.jobId)
    } catch (err) {
      console.log(err);
    }
  }

  // Freelancer Details

  const [userDetails, setUserDetails] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    experience: "",
    skills: [],
    projects: [],
    education: []
  });
  const FetchUserDetails = async (freelancerId: string) => {
    try {
      const res = await fetch(`https://freebirds-backend-latest.onrender.com/api/users/${freelancerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setUserDetails(data.data);
    } catch (err) {
      console.log(err);
    }
  }

  // Job ID
  const [jobDetails, setJobDetails] = useState<Job>({
    id: 0,
    budget: 0,
    clientId: 0,
    deadline: "",
    description: "",
    status: "",
    title: ""
  })
  const FetchJobDetails = async (jobId: string) => {
    try {
      const res = await fetch(`https://freebirds-backend-latest.onrender.com/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setJobDetails(data.job);
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    FetchProposalData();
  }, [proposalId]);


  // Proposal Status

  const [status, setStatus] = useState<string>('')

  const handleProposalStatus = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await fetch(`https://freebirds-backend-latest.onrender.com/api/proposals/${proposalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: status
        })
      });
      if(status === "ACCEPTED") {
        CreateContact();
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Create Contract

  const { id } = useParams()

  const CreateContact = async () => {
    try {
      const res = await fetch('https://freebirds-backend-latest.onrender.com/api/contracts', {
        method: "POST",
        headers : {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }, 
        body: JSON.stringify({
          clientId: id,
          jobId: proposal.jobId,
          freelancerId: proposal.freelancerId,
          status: "PENDING"
        })
      });
      const data = await res.json();
      console.log(data)
    }catch(err){
      console.log("Eoor",err);
    }
  }

  // Handle Window 
  // Window width handle

    const [windowSize, setWindowSize] = useState<number>(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowSize(window.innerWidth);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])

  return (
    windowSize > 1280 ? (
      <div className="bg-gray-50 flex flex-wrap gap-5 justify-evenly font-serif">
      {/* Proposal Details */}
      <div className="flex flex-col items-center justify-center gap-5 border border-gray-500 p-5 rounded h-[60vh] shadow-lg bg-gray-100 w-[20%]">
        <h1 className="text-4xl font-bold">Proposal Details</h1>
        <div className="flex flex-col gap-5 items-center text-gray-500">
          <FaRProject className="text-7xl" />
          <div className="flex flex-col gap-2 text-2xl items-center justify-center ">
            <p><b className="text-black">Status:</b> {proposal.status}</p>
            <button>Check Freelancer Details</button>
          </div>
        </div>
      </div>


      {/* Job ANd User Details */}
      {proposal.status === "ACCEPTED" ? (
        <div className="flex justify-center items-center text-gray-500 text-xl">
          <h1>Go to Contract Page to see the <button>Progress</button></h1>
        </div>
      ) :
        <div className="flex flex-col text-gray-700  justify-center items-center gap-5 p-10 w-[50%]">
          {/* Job Details */}
          <div className="flex flex-col items-center justify-center border rounded p-5 shadow-lg bg-gray-100 ">
            <h1 className="text-6xl text-black font-bold">Job Details</h1>
            <div className="flex flex-col flex-wrap gap-2 justify-center items-center ">
              <FaRProject className="text-7xl text-gray-300" />
              <h1><b>Title: </b>{jobDetails.title}</h1>
              <p><b>Description: </b>{jobDetails.description}</p>
              <p><b>DeadLine: </b>{jobDetails.deadline}</p>
              <p><b>Budget:</b> {jobDetails.budget}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="flex flex-col items-center justify-center border border-gray-500 rounded shadow-lg bg-gray-100 ">
            <h1 className="text-6xl font-bold text-black ">Freelancer Details</h1>
            <div className="flex flex-wrap flex-col items-center gap-5 ">

              {/* Basic Details */}
              <h1 className="text-4xl ">{userDetails.firstName} {userDetails.lastName}</h1>
              <div className="flex flex-wrap gap-10 ">
                <p className="flex items-center gap-2 "><FaMailBulk /> {userDetails.email}</p>
                <p className="flex items-center gap-2 "><FaPhone /> {userDetails.phoneNumber}</p>
              </div>

              {/* Experience */}
              <p className="text-2xl"><b className="text-black" >Experience: </b>{userDetails.experience}</p>

              {/* Education */}
              <div className="flex flex-col items-center gap-2 p-1">
                <h3 className="text-2xl font-bold text-black">Education</h3>
                {userDetails?.education?.length > 0 && (
                  <ul className="flex flex-wrap justify-around items-center gap-2">
                    {userDetails.education.map((edu) => (
                      <li key={edu.id} className="border rounded flex flex-col bg-gray-50 p-2 text-sm gap-2">
                        <h1><b>Course:</b> {edu.courseName}</h1>
                        <p><b>Specialization:</b> {edu.specialization}</p>
                        <p><b>Collage:</b> {edu.collegeName}</p>
                        <p><b>Complete Year:</b> {edu.endingyear}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>


              {/* Skills */}
              <div className="flex items-center flex-col gap-2 p-1">
                <h1 className="text-2xl font-bold text-black">Skills</h1>
                {userDetails?.skills?.length > 0 && (
                  <ul className="flex flex-wrap items-center justify-center gap-2">
                    {userDetails.skills.map((skill) => (
                      <li key={skill.id} className="border rounded  bg-gray-50 p-2 text-sm gap-2">{skill.skillName}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Projects */}
              <div className="flex flex-col items-center ">
                <h1 className="text-2xl font-bold text-black">Projects</h1>
                {userDetails?.projects?.length > 0 && (
                  <ul className="flex flex-wrap items-center justify-center gap-2 p-1">
                    {userDetails.projects.map((project) => (
                      <li key={project.id} className="border rounded  bg-gray-50 p-2 text-sm gap-2">
                        <h1><b>Name:</b> {project.projectName}</h1>
                        <p><b>Description:</b> {project.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      }

      {/* Change The Proposal */}
      <div className="flex flex-col items-center justify-center gap-5 border border-gray-500 p-5 rounded h-[60vh] shadow-lg bg-gray-100 w-[20%]">
        <h1 className="text-4xl font-bold">Update Proposal Status</h1>
        <div className="flex flex-col gap-5 items-center text-gray-500">
          <FaRProject className="text-7xl" />
          <div className="flex flex-col gap-2 text-2xl items-center justify-center ">
            <form action="put" onSubmit={handleProposalStatus}>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="PENDING"
                    checked={status === "PENDING"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Pending
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="ACCEPTED"
                    checked={status === "ACCEPTED"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Accepted
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="REJECTED"
                    checked={status === "REJECTED"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Rejected
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="WITHDRAWN"
                    checked={status === "WITHDRAWN"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Withdrawn
                </label>
              </div>

              <input type="submit" className='top-5 right-5 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-gray-700 border cursor-pointer' />
            </form>
          </div>
        </div>
      </div>
    </div>
    ) : (
      <div className="bg-gray-50 flex flex-col gap-5 justify-center items-center font-serif overflow-hidden p-5">
      {/* Proposal Details */}
      <div className="flex flex-col items-center justify-center gap-5 border border-gray-500 p-5 rounded shadow-lg bg-gray-100 w-[300px]">
        <h1 className="text-4xl font-bold">Proposal Details</h1>
        <div className="flex flex-col gap-5 items-center text-gray-500">
          <FaRProject className="text-7xl" />
          <div className="flex flex-col gap-2 text-2xl items-center justify-center ">
            <p><b className="text-black">Status:</b> {proposal.status}</p>
            <button>Check Freelancer Details</button>
          </div>
        </div>
      </div>


      {/* Job ANd User Details */}
      {proposal.status === "ACCEPTED" ? (
        <div className="flex justify-center items-center text-gray-500 text-xl">
          <h1>Go to Contract Page to see the <button>Progress</button></h1>
        </div>
      ) :
        <div className="flex flex-col text-gray-700  justify-center items-center gap-5 p-10 w-[300px]">
          {/* Job Details */}
          <div className="flex flex-col items-center justify-center border rounded p-5 shadow-lg bg-gray-100 ">
            <h1 className="text-6xl text-black font-bold">Job Details</h1>
            <div className="flex flex-col flex-wrap gap-2 justify-center items-center ">
              <FaRProject className="text-7xl text-gray-300" />
              <h1><b>Title: </b>{jobDetails.title}</h1>
              <p><b>Description: </b>{jobDetails.description}</p>
              <p><b>DeadLine: </b>{jobDetails.deadline}</p>
              <p><b>Budget:</b> {jobDetails.budget}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="flex flex-col items-center justify-center border border-gray-500 rounded shadow-lg bg-gray-100 p-10">
            <h1 className="text-6xl font-bold text-black ">Freelancer Details</h1>
            <div className="flex flex-wrap flex-col items-center gap-5 ">

              {/* Basic Details */}
              <h1 className="text-4xl ">{userDetails.firstName} {userDetails.lastName}</h1>
              <div className="flex flex-wrap gap-10 ">
                <p className="flex items-center gap-2 "><FaMailBulk /> {userDetails.email}</p>
                <p className="flex items-center gap-2 "><FaPhone /> {userDetails.phoneNumber}</p>
              </div>

              {/* Experience */}
              <p className="text-2xl"><b className="text-black" >Experience: </b>{userDetails.experience}</p>

              {/* Education */}
              <div className="flex flex-col items-center gap-2 p-1">
                <h3 className="text-2xl font-bold text-black">Education</h3>
                {userDetails?.education?.length > 0 && (
                  <ul className="flex flex-wrap justify-around items-center gap-2">
                    {userDetails.education.map((edu) => (
                      <li key={edu.id} className="border rounded flex flex-col bg-gray-50 p-2 text-sm gap-2">
                        <h1><b>Course:</b> {edu.courseName}</h1>
                        <p><b>Specialization:</b> {edu.specialization}</p>
                        <p><b>Collage:</b> {edu.collegeName}</p>
                        <p><b>Complete Year:</b> {edu.endingyear}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>


              {/* Skills */}
              <div className="flex items-center flex-col gap-2 p-1">
                <h1 className="text-2xl font-bold text-black">Skills</h1>
                {userDetails?.skills?.length > 0 && (
                  <ul className="flex flex-wrap items-center justify-center gap-2">
                    {userDetails.skills.map((skill) => (
                      <li key={skill.id} className="border rounded  bg-gray-50 p-2 text-sm gap-2">{skill.skillName}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Projects */}
              <div className="flex flex-col items-center ">
                <h1 className="text-2xl font-bold text-black">Projects</h1>
                {userDetails?.projects?.length > 0 && (
                  <ul className="flex flex-wrap items-center justify-center gap-2 p-1">
                    {userDetails.projects.map((project) => (
                      <li key={project.id} className="border rounded  bg-gray-50 p-2 text-sm gap-2">
                        <h1><b>Name:</b> {project.projectName}</h1>
                        <p><b>Description:</b> {project.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      }

      {/* Change The Proposal */}
      <div className="flex flex-col items-center justify-center gap-5 border border-gray-500 p-5 rounded shadow-lg bg-gray-100 w-[300px]">
        <h1 className="text-4xl font-bold">Update Proposal Status</h1>
        <div className="flex flex-col gap-5 items-center text-gray-500">
          <FaRProject className="text-7xl" />
          <div className="flex flex-col gap-2 text-2xl items-center justify-center ">
            <form action="put" onSubmit={handleProposalStatus}>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="PENDING"
                    checked={status === "PENDING"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Pending
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="ACCEPTED"
                    checked={status === "ACCEPTED"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Accepted
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="REJECTED"
                    checked={status === "REJECTED"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Rejected
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="WITHDRAWN"
                    checked={status === "WITHDRAWN"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Withdrawn
                </label>
              </div>

              <input type="submit" className='top-5 right-5 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-gray-700 border cursor-pointer' />
            </form>
          </div>
        </div>
      </div>
    </div>
    )
  )
}

export default Choosing