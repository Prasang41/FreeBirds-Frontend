import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Freelancer from './Freelancer';
import Client from './Client';

function Proposal() {

  const { id } = useParams();
  const token = localStorage.getItem("authToken");

  // User Data 

  const [role, setRole] = useState<string>('');
  const UserData = async () => {
    try {
      const res = await fetch(`https://freebirds-backend-latest.onrender.com/api/users/${id}`, {
        headers : {
          Authorization : `Bearer ${token}`
        }
      });
      const data =await res.json();
      setRole(data.data.role);
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    UserData();
  }, [])

  return (
    <div className='bg-gray-50'>
      {/* First go to login */}
      {!id || id === "undefined" ? (
        <div className='flex flex-col justify-center items-center gap-5 h-[80vw]'>
          <h1 className='text-3xl font-bold'>Please Login to see The Proposals.</h1>
        </div>
      ) : ( role === "FREELANCER" ? 
        <Freelancer /> : <Client />
      )
      }
    </div >
  )
}

export default Proposal