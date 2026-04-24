import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { CiLight, CiMenuFries } from 'react-icons/ci'
import { FaUser } from 'react-icons/fa'
import { IoIosNotifications } from 'react-icons/io'
import { MdDarkMode } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Home', to: (id: string) => `home/${id}` },
  { label: 'Proposal', to: (id: string) => `proposal/${id}` },
  { label: 'Contract', to: (id: string) => `contract/${id}` },
  { label: 'Jobs', to: (id: string) => `jobs/${id}` },
];

function Header() {
  const [theme, setTheme] = useState<boolean>(true);
  const handleTheme = () => setTheme(!theme);

  const { id } = useParams();

  const [windowSize, setWindowSize] = useState<number>(window.innerWidth);
  useEffect(() => {
    const h = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const [menu, setMenu] = useState<boolean>(true);
  const handleMenu = () => setMenu(!menu);

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = !menu ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [menu]);

  // Hide/show on scroll
  const [showNavbar, setShowNavbar] = useState(true);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const curr = window.scrollY;
      setShowNavbar(curr < lastY || curr < 10);
      lastY = curr;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDesktop = windowSize > 1200;

  // ── shared nav link style ─────────────────────────────────────
  const navLinkCls = `
    relative text-sm font-medium text-white/70 hover:text-white
    transition-colors duration-150
    after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0
    after:bg-white after:transition-all after:duration-200
    hover:after:w-full
  `;

  const iconBtnCls = `
    w-9 h-9 rounded-xl flex items-center justify-center
    text-white/60 hover:text-white hover:bg-white/10
    transition-all duration-150
  `;

  return (
    <div>
      {/* ── DESKTOP NAV ─────────────────────────────────────────── */}
      {isDesktop && (
        <motion.nav
          initial={{ y: 0 }}
          animate={{ y: showNavbar ? 0 : -100 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-8
                     bg-[#1a1a1a]/90 backdrop-blur-md border-b border-white/[0.06]"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src="../Free_Birds_Logo.png" alt="FreeBirds" className="h-12" />
          </Link>

          {/* Nav links */}
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link to={to(id ?? '')} className={navLinkCls}>{label}</Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Notification */}
            <Link to={`notification/${id}`} className={iconBtnCls}>
              <IoIosNotifications className="text-xl" />
            </Link>

            {/* User */}
            <Link to={`user/${id}`} className={iconBtnCls}>
              <FaUser className="text-base" />
            </Link>

            {/* Theme toggle */}
            <button onClick={handleTheme} className={iconBtnCls}>
              {theme ? <MdDarkMode className="text-lg" /> : <CiLight className="text-lg" />}
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-white/10 mx-1" />

            {/* Login */}
            <Link
              to="login"
              className="px-4 py-1.5 rounded-xl text-sm font-medium text-white/70
                         border border-white/15 hover:border-white/30 hover:text-white
                         transition-all duration-150"
            >
              Login
            </Link>

            {/* Register */}
            <Link
              to=""
              className="px-4 py-1.5 rounded-xl text-sm font-semibold
                         bg-white text-[#1a1a1a] hover:bg-white/90
                         active:scale-95 transition-all duration-150"
            >
              Register
            </Link>
          </div>
        </motion.nav>
      )}

      {/* ── MOBILE NAV ──────────────────────────────────────────── */}
      {!isDesktop && (
        <>
          <motion.nav
            initial={{ y: 0 }}
            animate={{ y: showNavbar ? 0 : -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-5
                       bg-[#1a1a1a]/90 backdrop-blur-md border-b border-white/[0.06]"
          >
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="../Free_Birds_Logo.png" alt="FreeBirds" className="h-12" />
            </Link>

            {/* Right icons + hamburger */}
            <div className="flex items-center gap-1">
              <Link to={`notification/${id}`} className={iconBtnCls}>
                <IoIosNotifications className="text-xl" />
              </Link>
              <Link to={`user/${id}`} className={iconBtnCls}>
                <FaUser className="text-base" />
              </Link>
              <button onClick={handleTheme} className={iconBtnCls}>
                {theme ? <MdDarkMode className="text-lg" /> : <CiLight className="text-lg" />}
              </button>
              <button onClick={handleMenu} className={`${iconBtnCls} ml-1`}>
                {menu
                  ? <CiMenuFries className="text-xl" />
                  : <AiOutlineClose className="text-xl" />}
              </button>
            </div>
          </motion.nav>

          {/* Mobile drawer */}
          <AnimatePresence>
            {!menu && (
              <motion.div
                key="mobile-menu"
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-100%', opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="fixed inset-0 z-40 bg-[#0e0e0e] flex flex-col pt-16"
              >
                {/* subtle dot pattern */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
                />

                <div className="relative flex flex-col justify-between h-full px-8 py-10">

                  {/* Nav links */}
                  <nav className="flex flex-col gap-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/20 mb-4">
                      Navigation
                    </p>
                    {NAV_LINKS.map(({ label, to }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i + 0.1 }}
                      >
                        <Link
                          to={to(id ?? '')}
                          onClick={() => setMenu(true)}
                          className="block py-3 text-2xl font-bold text-white/60 hover:text-white
                                     border-b border-white/[0.06] transition-colors duration-150"
                        >
                          {label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>

                  {/* Auth buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col gap-3"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/20 mb-1">
                      Account
                    </p>
                    <Link
                      to="login"
                      onClick={() => setMenu(true)}
                      className="w-full text-center py-3 rounded-2xl text-sm font-medium
                                 border border-white/15 text-white/70 hover:border-white/30 hover:text-white
                                 transition-all duration-150"
                    >
                      Login
                    </Link>
                    <Link
                      to=""
                      onClick={() => setMenu(true)}
                      className="w-full text-center py-3 rounded-2xl text-sm font-semibold
                                 bg-white text-[#1a1a1a] hover:bg-white/90
                                 active:scale-95 transition-all duration-150"
                    >
                      Register
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

export default Header