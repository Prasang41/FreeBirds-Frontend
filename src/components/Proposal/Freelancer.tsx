import { useEffect, useState } from 'react'
import { FaRProject } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

type Proposal = {
    id: number;
    bidAmount: number;
    coverLetter: string;
    status: string;
    jobId: number;
    freelancerId: number;
}

function Freelancer() {
    const { id } = useParams();
    const token = localStorage.getItem("authToken");
    const [proposal, setProposal] = useState<Proposal[]>([])

    const FetchProposal = async () => {
        try {
            const res = await fetch(`${API_URL}/api/proposals/freelancer/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setProposal(data.proposals);
            console.log(data.proposals)
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        FetchProposal();
    }, [id])


    return (
        <div className='flex flex-col justify-center pt-30 p-5'>
            <h1 className='text-6xl text-center'>Proposals</h1>
            <div className='flex flex-wrap gap-10 justify-center mt-10'>
                {proposal.map((p: Proposal) => (
                    <button
                        key={p.id}
                        // onClick={() => handleJob(job.id)}
                        className='flex flex-col items-center justify-center w-[300px] border bg-white p-5 rounded-lg shadow-xl gap-3 mt-5 '
                    >
                        <FaRProject className='text-5xl' />
                        <h1 className='font-bold font-serif text-center text-2xl'>{p.status}</h1>
                        <div className='flex flex-col justify-center items-center gap-2 text-sm'>
                            <p>{p.coverLetter}</p>
                            <p>Salary:{p.bidAmount}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Freelancer