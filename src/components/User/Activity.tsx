import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Review from '../Review/Review';

type ActivityProps = {
    role: string;
};

type Proposal = {
    id: number;
    status: string;
}
type Contract = {
    id: number;
    status: string;
}

function Activity({ role }: ActivityProps) {

    // Fetching id
    const { id } = useParams();
    const token = localStorage.getItem("authToken");

    // Proposal Details
    const [totalProposal, setTotalProposal] = useState<number>(0);
    const [proposal, setProposal] = useState<Proposal[]>([])
    const TotalProposal = async () => {
        try {
            const res = await fetch('https://freebirds-backend-latest.onrender.com/api/users/my-proposals', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setTotalProposal(data.data.length);
            setProposal(data.data);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        TotalProposal();
    }, [id])

    const proposalPending = proposal.filter((p: Proposal) => p.status === 'PENDING').length;
    const proposalAccepted = proposal.filter((p: Proposal) => p.status === 'ACCEPTED').length;
    const proposalRejected = proposal.filter((p: Proposal) => p.status === 'REJECTED').length;
    const proposalWithdrawn = proposal.filter((p: Proposal) => p.status === 'WITHDRAWN').length;

    // Contract Details
    const [totalContract, setTotalContract] = useState<number>();
    const [contractStatus, setContractStatus] = useState<Contract[]>([]);
    const TotalContract = async () => {
        try {
            const res = await fetch('/api/users/my-contracts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setTotalContract(data.contracts.length);
            setContractStatus(data.contracts);
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        TotalContract()
    }, [id])

    const contractPending = contractStatus.filter((p: Contract) => p.status === 'PENDING').length;
    const contractActive = contractStatus.filter((p: Contract) => p.status === 'ACTIVE').length;
    const contractCompleted = contractStatus.filter((p: Contract) => p.status === 'COMPLETED').length;
    const contractTerminated = contractStatus.filter((p: Contract) => p.status === 'TERMINATED').length;


    return (
        <div>{role === "FREELANCER" ? (
            <div className='flex flex-col items-center justify-center p-10 shadow-lg m-2 rounded'>
                {/* Proposal Details */}
                <div className='flex flex-col text-gray-700 items-center '>
                    <h1 className='text-4xl font-bold text-gray-900 p-5'>Proposals</h1>
                    <div className='flex items-center flex-wrap justify-evenly gap-10 '>
                        <h1 className='text-2xl'><b className='text-gray-900'>Total proposals: </b>{totalProposal}</h1>
                        <ul className='flex flex-col items-start gap-5 text-xl'>
                            <li><b className='text-gray-900'>Pending proposals: </b>{proposalPending}</li>
                            <li><b className='text-gray-900'>Accepted proposals: </b>{proposalAccepted}</li>
                            <li><b className='text-gray-900'>Rejected proposals: </b>{proposalRejected}</li>
                            <li><b className='text-gray-900'>Withdrawn proposals: </b>{proposalWithdrawn}</li>
                        </ul>
                    </div>
                </div>


                {/* Contract Details */}
                <div className='flex flex-col text-gray-700 items-center '>
                    <h1 className='text-4xl font-bold text-gray-900 p-5'>Contracts</h1>
                    <div className='flex items-center flex-wrap justify-evenly gap-10 '>
                        <h1 className='text-2xl'><b className='text-gray-900'>Total contract: </b>{totalContract}</h1>
                        <ul className='flex flex-col items-start gap-5 text-xl'>
                            <li><b className='text-gray-900'>Pending contracts: </b>{contractPending}</li>
                            <li><b className='text-gray-900'>Active contracts: </b>{contractActive}</li>
                            <li><b className='text-gray-900'>Completed contracts: </b>{contractCompleted}</li>
                            <li><b className='text-gray-900'>Terminated contracts: </b>{contractTerminated}</li>
                        </ul>
                    </div>
                </div>
            </div>
        ) : (
            <div className='flex flex-col items-center justify-center p-10 shadow-lg m-2 rounded'>
                {/* Proposal Details */}
                <div className='flex flex-col text-gray-700 items-center '>
                    <h1 className='text-4xl font-bold text-gray-900 p-5'>Proposals</h1>
                    <div className='flex items-center flex-wrap justify-evenly gap-10 '>
                        <h1 className='text-2xl'><b className='text-gray-900'>Total proposals: </b>{totalProposal}</h1>
                        <ul className='flex flex-col items-start gap-5 text-xl'>
                            <li><b className='text-gray-900'>Pending proposals: </b>{proposalPending}</li>
                            <li><b className='text-gray-900'>Accepted proposals: </b>{proposalAccepted}</li>
                            <li><b className='text-gray-900'>Rejected proposals: </b>{proposalRejected}</li>
                            <li><b className='text-gray-900'>Withdrawn proposals: </b>{proposalWithdrawn}</li>
                        </ul>
                    </div>
                </div>


                {/* Contract Details */}
                <div className='flex flex-col text-gray-700 items-center '>
                    <h1 className='text-4xl font-bold text-gray-900 p-5'>Contracts</h1>
                    <div className='flex items-center flex-wrap justify-evenly gap-10 '>
                        <h1 className='text-2xl'><b className='text-gray-900'>Total contract: </b>{totalContract}</h1>
                        <ul className='flex flex-col items-start gap-5 text-xl'>
                            <li><b className='text-gray-900'>Pending contracts: </b>{contractPending}</li>
                            <li><b className='text-gray-900'>Active contracts: </b>{contractActive}</li>
                            <li><b className='text-gray-900'>Completed contracts: </b>{contractCompleted}</li>
                            <li><b className='text-gray-900'>Terminated contracts: </b>{contractTerminated}</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}
        </div>
    )
}

export default Activity;
