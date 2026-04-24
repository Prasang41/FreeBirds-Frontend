import React from 'react'
import { Link, useParams } from 'react-router-dom'
function Footer() {

  const { id } = useParams()
  return (
    <footer className="bg-gray-50 text-gray-900 py-10 px-6 border-t border-gray-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Tagline */}
        <div>
          <img src="../Free_Birds_Logo.png" alt="" />
          <p className="text-sm text-gray-900">Empowering talent. Connecting opportunities.</p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Explore</h3>
          <ul className="space-y-1 text-sm text-gray-500 flex flex-col">
            <Link to={`home/${id}`} className="hover:text-black">Home</Link>
            <Link to={`proposal/${id}`}className="hover:text-black">Proposal</Link>
            <Link to={`contract/${id}`}className="hover:text-black">Contract</Link>
            <Link to={`jobs/${id}`}className="hover:text-black">Jobs</Link>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>Email: FreeBirds@help.com</li>
            <li>Phone: +91 96375 28000</li>
            <li>Location: Bijnor, UP</li>
          </ul>
        </div>

        {/* Social & Theme */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-white"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-white"><i className="fab fa-linkedin"></i></a>
            <a href="#" className="hover:text-white"><i className="fab fa-github"></i></a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Proffer. All rights reserved.
      </div>
    </footer>

  )
}

export default Footer