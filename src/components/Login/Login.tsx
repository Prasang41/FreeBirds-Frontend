import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();

  // Email
  const [email, setEmail] = useState<string>('');

  // Password
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === '') {
      alert("Enter Email");
      return;
    }

    if (password === '') {
      alert("Enter Password");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/users/login`, { email, password});
      const data = res.data;
      localStorage.setItem("authToken", data.token);
      console.log(data);
      navigate(`/user/${data.user.id}`);
    } catch (err: unknown) {
      const error = err as AxiosError;
      alert(error.response?.data || error.message);
    }
  }

  // Window width handle

  const [windowSize, setWindowSize] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center p-5 font-sans">
 
      <div className="w-full max-w-md flex flex-col gap-8">
 
        {/* Logo + heading */}
        <div className="flex flex-col items-center gap-3">
          <img src="../Free_Birds_Logo.png" alt="FreeBirds" className="h-12" />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#1a1a1a] tracking-tight">Welcome back</h1>
            <p className="text-sm text-[#999] mt-1">Sign in to your FreeBirds account</p>
          </div>
        </div>
 
        {/* Card */}
        <div className="bg-white border border-[#e5e5e0] rounded-3xl p-8 shadow-sm flex flex-col gap-6">
 
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            {/* Email */}
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#999]">Email</span>
              <input
                type="email"
                placeholder="harry@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e0e0da] bg-[#fafaf8] text-[#1a1a1a] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a] transition placeholder:text-[#bbb]"
              />
            </label>
 
            {/* Password */}
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#999]">Password</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e0e0da] bg-[#fafaf8] text-[#1a1a1a] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a] transition placeholder:text-[#bbb]"
              />
            </label>
 
            {/* Submit */}
            <input
              type="submit"
              value="Sign In"
              className="w-full py-3 mt-1 rounded-xl bg-[#1a1a1a] text-white text-sm font-semibold cursor-pointer hover:bg-[#333] active:scale-95 transition-all duration-150"
            />
          </form>
 
          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#e5e5e0]" />
            <span className="text-[11px] text-[#bbb] font-medium">OR</span>
            <div className="flex-1 h-px bg-[#e5e5e0]" />
          </div>
 
          {/* Register */}
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl text-sm font-medium border border-[#e0e0da] text-[#555] bg-white hover:border-[#1a1a1a] hover:text-[#1a1a1a] active:scale-95 transition-all duration-150"
          >
            Create an account
          </button>
        </div>
 
      </div>
    </div>
  )
}

export default Login