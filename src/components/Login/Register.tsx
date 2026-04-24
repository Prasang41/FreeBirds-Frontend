import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {

  // Navigator
  const navigate = useNavigate();

  // Name
  const [firstName, setFirstName] = useState<string>('');

  // Last Name
  const [lastName, setLastName] = useState<string>('');

  // Email Checker
  const [email, setEmail] = useState<string>('');

  // Phone Number
  const [phone, setPhone] = useState<string>('');

  // Role
  const [role, setRole] = useState<string>('');

  // Password
  const [password, setPassword] = useState<string>('');

  // Confirm Password
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Mismatch Password");
      return;
    }

    if (firstName === '') {
      alert("Null First Name");
      return;
    }

    if (email === '') {
      alert("Null Email");
      return;
    }

    if (phone === '') {
      alert("Null Phone Number");
      return;
    }

    if (password === '') {
      alert("Null password");
      return;
    }


    try {
      const res = await axios.post('https://freebirdsbackend-v1.onrender.com/api/users/register', {
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        role,
        password
      });

      console.log(res.data);
      navigate('/login');
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.log(error.response?.data || error.message);
    }
  };

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
            <h1 className="text-3xl font-bold text-[#1a1a1a] tracking-tight">Create an account</h1>
            <p className="text-sm text-[#999] mt-1">Join FreeBirds and get started</p>
          </div>
        </div>
 
        {/* Card */}
        <div className="bg-white border border-[#e5e5e0] rounded-3xl p-8 shadow-sm flex flex-col gap-6">
 
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
 
            {/* First Name + Last Name — side by side */}
            <div className="flex gap-4">
              <label className="flex flex-col gap-1.5 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#999]">First Name</span>
                <input
                  type="text"
                  placeholder="Harry"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e0e0da] bg-[#fafaf8] text-[#1a1a1a] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a] transition placeholder:text-[#bbb]"
                />
              </label>
              <label className="flex flex-col gap-1.5 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#999]">Last Name</span>
                <input
                  type="text"
                  placeholder="Sharma"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e0e0da] bg-[#fafaf8] text-[#1a1a1a] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a] transition placeholder:text-[#bbb]"
                />
              </label>
            </div>
 
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
 
            {/* Phone Number */}
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#999]">Phone Number</span>
              <input
                type="tel"
                placeholder="8273xxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e0e0da] bg-[#fafaf8] text-[#1a1a1a] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a] transition placeholder:text-[#bbb]"
              />
            </label>
 
            {/* Role */}
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#999]">Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e0e0da] bg-[#fafaf8] text-[#1a1a1a] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a] transition cursor-pointer"
              >
                <option value="">Select Role</option>
                <option value="FREELANCER">Freelancer</option>
                <option value="CLIENT">Client</option>
              </select>
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
 
            {/* Confirm Password */}
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#999]">Confirm Password</span>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e0e0da] bg-[#fafaf8] text-[#1a1a1a] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a] transition placeholder:text-[#bbb]"
              />
            </label>
 
            {/* Submit */}
            {windowSize > 1280 ? (
              <input
                type="submit"
                value="Create Account"
                className="w-full py-3 mt-1 rounded-xl bg-[#1a1a1a] text-white text-sm font-semibold cursor-pointer hover:bg-[#333] active:scale-95 transition-all duration-150"
              />
            ) : (
              <input
                type="submit"
                value="Create Account"
                className="w-full py-3 mt-1 rounded-xl bg-[#1a1a1a] text-white text-sm font-semibold cursor-pointer hover:bg-[#333] active:scale-95 transition-all duration-150"
              />
            )}
          </form>
 
          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#e5e5e0]" />
            <span className="text-[11px] text-[#bbb] font-medium">OR</span>
            <div className="flex-1 h-px bg-[#e5e5e0]" />
          </div>
 
          {/* Login */}
          {windowSize > 1280 ? (
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl text-sm font-medium border border-[#e0e0da] text-[#555] bg-white hover:border-[#1a1a1a] hover:text-[#1a1a1a] active:scale-95 transition-all duration-150"
            >
              Already have an account? Sign in
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl text-sm font-medium border border-[#e0e0da] text-[#555] bg-white hover:border-[#1a1a1a] hover:text-[#1a1a1a] active:scale-95 transition-all duration-150"
            >
              Already have an account? Sign in
            </button>
          )}
        </div>
 
      </div>
    </div>
  )
}

export default Register