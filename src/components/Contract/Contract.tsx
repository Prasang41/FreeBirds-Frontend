import axios from "axios";
import { useEffect, useState } from "react";
import { FaRProject } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useParams } from "react-router-dom";

type Contract = {
    id?: number;
    clientId: number;
    clientName: string;
    freelancerId: number;
    freelancerName?: string;
    jobId: number;
    jobTitle?: string;
    status: string;
}

function Contract() {

    const token = localStorage.getItem("authToken");
    const [contract, setContract] = useState<Contract[]>([]);
    const FetchContracts = async () => {
        try {
            const res = await fetch('https://freebirds-backend-latest.onrender.com/api/users/my-contracts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setContract(data.contracts);
            enrichContracts(data.contracts);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        FetchContracts();
    }, [])

    // Enriched Contracts
    const enrichContracts = async (contracts: Contract[]) => {
        const enriched = await Promise.all(contracts.map(async (c) => {
            let jobTitle = '';
            let freelancerName = '';
            let clientName = '';
            // JobTitle
            try {
                const jobRes = await fetch(`https://freebirds-backend-latest.onrender.com/api/jobs/${c.jobId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const jobData = await jobRes.json();
                jobTitle = jobData.job.title;
            } catch { /* empty */ }

            // Freelaner Name
            try {
                const userRes = await fetch(`https://freebirds-backend-latest.onrender.com/api/users/${c.freelancerId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData = await userRes.json();
                freelancerName = `${userData.data.firstName} ${userData.data.lastName}`;
            } catch { /* empty */ }

            // Cleint Name
            try {
                const userRes = await fetch(`https://freebirds-backend-latest.onrender.com/api/users/${c.clientId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData = await userRes.json();
                clientName = `${userData.data.firstName} ${userData.data.lastName}`;
            } catch { /* empty */ }

            return { ...c, jobTitle, freelancerName, clientName };
        }));
        setContract(enriched);
    };



    // Check user is Freelancer or Client
    const { id } = useParams();
    const [role, setRole] = useState<string>('');
    const Checking = async () => {
        try {
            const res = await fetch(`https://freebirds-backend-latest.onrender.com/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (data?.data?.role) {
                setRole(data.data.role);
            } else {
                console.warn("User role not found:", data);
            }
        } catch (err) {
            console.error("Error checking user role:", err);
        }
    };


    useEffect(() => {
        Checking()
    }, [id])

    // HandleDelete

    const handleDelete = async (contractId: number) => {
        try {
            await axios.delete(`https://freebirds-backend-latest.onrender.com/api/contracts/${contractId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }); 
        } catch (err) {
            console.error(err);
        }
    };

    // Edit Status

    const [status, setStatus] = useState<string>('');

    const handleUpdateStatus = async (e: React.FormEvent, contractId: number) => {
        e.preventDefault();


        try {
            const res = await fetch(`https://freebirds-backend-latest.onrender.com/api/contracts/${contractId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: status })
            });

            if (res.ok) {
                console.log("Status updated");
                FetchContracts(); 
            }
        } catch (err) {
            console.log(err);
        }
    };



    return (
        <div className="bg-gray-50 pt-28 p-5">
            {role === "CLIENT" ? (
                <div className='flex flex-col justify-center'>
                    <h1 className='text-6xl text-center'>Contracts</h1>
                    <div className='flex flex-wrap gap-10 justify-center mt-10'>
                        {contract.map((p: Contract) => (
                            <div
                                key={p.id}
                                // onClick={() => handleJob(job.id)}
                                className='flex flex-col items-center justify-center w-[300px] border bg-white p-5 rounded-lg shadow-xl gap-3 mt-5'
                            >
                                <FaRProject className='text-5xl' />
                                <h1 className='font-bold font-serif text-center text-2xl'>{p.status}</h1>
                                <div className='flex flex-col justify-center items-center gap-2 text-sm'>
                                    <p><b>Freelancer Name: </b>{p.freelancerName}</p>
                                    <p><b>Job Title: </b>{p.jobTitle}</p>
                                    <button onClick={() => p.id !== undefined && handleDelete(p.id)} className='text-4xl border rounded p-1 bg-gray-500 text-white hover:bg-gray-50 hover:text-gray-500 cursor-pointer '><MdDelete /> </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='flex flex-col justify-center'>
                    <h1 className='text-6xl text-center'>Contracts</h1>
                    <div className='flex flex-wrap gap-10 justify-center mt-10'>
                        {contract.map((p: Contract) => (
                            <div
                                key={p.id}
                                // onClick={() => handleJob(job.id)}
                                className='flex flex-col items-center justify-center w-[300px] border bg-white p-5 rounded-lg shadow-xl gap-3 mt-5 '
                            >
                                <FaRProject className='text-5xl' />
                                <h1 className='font-bold font-serif text-center text-2xl'>{p.status}</h1>
                                <div className='flex flex-col justify-center items-center gap-2 text-sm'>
                                    <p><b>Client Name: </b>{p.clientName}</p>
                                    <p><b>Job Title: </b>{p.jobTitle}</p>

                                    {/* edit status */}
                                    <form onSubmit={(e) => { if (p.id !== undefined) handleUpdateStatus(e, p.id); }} >
                                        <div className="flex flex-col gap-4">
                                            <label className="text-lg font-semibold">Update Contract Status</label>
                                            <select
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className="border rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="ACTIVE">Active</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="TERMINATED">Terminated</option>
                                            </select>

                                            <input
                                                type="submit"
                                                value="Update Status"
                                                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-gray-700 border cursor-pointer"
                                            />
                                        </div>
                                    </form>

                                    {/* Delete */}
                                    <button onClick={() => p.id !== undefined && handleDelete(p.id)} className='text-4xl border rounded p-1 bg-gray-500 text-white hover:bg-gray-50 hover:text-gray-500 cursor-pointer '><MdDelete /> </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Contract