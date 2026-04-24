import axios from "axios";
import { useEffect, useState } from "react";
import { FaRProject } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Outlet, useNavigate, useParams } from "react-router-dom"

type Proposal = {
    id: number;
    bidAmount: number;
    coverLetter: string;
    status: string;
    jobId: number;
}

function Client() {

    const { id } = useParams();
    const token = localStorage.getItem("authToken");

    // Fetched Data of Client Proposal

    const [proposal, setProposal] = useState<Proposal[]>([])

    const FetchProposals = async () => {
        try {
            const res = await fetch(`https://freebirds-backend-latest.onrender.com/api/proposals/client/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setProposal(data.proposals)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        FetchProposals()
    }, [id])

    // Handle Proposal

    const navigate = useNavigate();
    const { proposalId } = useParams();

    const [openProposal, setOpenProposal] = useState<boolean>(false);

    const handleProposal = (proposalId: string) => {
        navigate(`particular-proposal/${proposalId}`)
    }


    useEffect(() => {
        if (proposalId) {
            setOpenProposal(true);
        } else {
            setOpenProposal(false);

        }
    }, [proposalId]);


    // HandleDelete

    const handleDelete = async (proposalsId: number) => {
        try {
            await axios.delete(`https://freebirds-backend-latest.onrender.com/api/proposals/${proposalsId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }); 
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="pt-35">
            {openProposal ?
                <Outlet /> :
                <div className='flex flex-col justify-center pb-5'>
                    <h1 className='text-6xl text-center'>Proposals</h1>
                    <div className='flex flex-wrap gap-10 justify-center mt-10'>
                        {proposal.map((p: Proposal) => (
                            <button
                                key={p.id}
                                onClick={() => handleProposal(p.id.toString())}
                                className='flex flex-col items-center justify-center w-[300px] border bg-white p-5 rounded-lg shadow-xl gap-3 mt-5 cursor-pointer'
                            >
                                <FaRProject className='text-5xl' />
                                <h1 className='font-bold font-serif text-center text-2xl'>{p.status}</h1>
                                <div className='flex flex-col justify-center items-center gap-2 text-sm'>
                                    <p>{p.coverLetter}</p>
                                    <p>Amount:{p.bidAmount}</p>

                                     <button onClick={() => p.id !== undefined && handleDelete(p.id)} className='text-4xl border rounded p-1 bg-gray-500 text-white hover:bg-gray-50 hover:text-gray-500 cursor-pointer '><MdDelete /> </button>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}

export default Client