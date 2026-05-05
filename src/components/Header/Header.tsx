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
    relative text-[13px] font-medium tracking-widest uppercase text-zinc-400 hover:text-amber-300
    transition-colors duration-200
    after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0
    after:bg-amber-400 after:transition-all after:duration-300
    hover:after:w-full
  `;

  const iconBtnCls = `
    w-9 h-9 rounded-lg flex items-center justify-center
    text-zinc-500 hover:text-amber-300 hover:bg-amber-400/10
    border border-transparent hover:border-amber-400/20
    transition-all duration-200
  `;

  return (
    <div>
      {/* ── DESKTOP NAV ─────────────────────────────────────────── */}
      {isDesktop && (
        <motion.nav
          initial={{ y: 0 }}
          animate={{ y: showNavbar ? 0 : -100 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed top-0 left-0 z-50 w-full h-[68px] flex items-center justify-between px-10
                     bg-[#0a0a0b]/95 backdrop-blur-xl
                     border-b border-zinc-800/60
                     shadow-[0_1px_0_0_rgba(251,191,36,0.04)]"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <img
              src="../Free_Birds_Logo.png"
              alt="FreeBirds"
              className="h-11 opacity-90 group-hover:opacity-100 transition-opacity duration-200"
            />
          </Link>

          {/* Nav links */}
          <ul className="flex items-center gap-9">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link to={to(id ?? '')} className={navLinkCls}>{label}</Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Notification */}
            <Link to={`notification/${id}`} className={iconBtnCls}>
              <IoIosNotifications className="text-xl" />
            </Link>

            {/* User */}
            <Link to={`user/${id}`} className={iconBtnCls}>
              <FaUser className="text-sm" />
            </Link>

            {/* Theme toggle */}
            <button onClick={handleTheme} className={iconBtnCls}>
              {theme ? <MdDarkMode className="text-base" /> : <CiLight className="text-base" />}
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-zinc-800 mx-2" />

            {/* Login */}
            <Link
              to="login"
              className="px-5 py-2 rounded-lg text-[13px] font-medium tracking-wide text-zinc-400
                         border border-zinc-700 hover:border-amber-400/40 hover:text-amber-300
                         transition-all duration-200"
            >
              Login
            </Link>

            {/* Register */}
            <Link
              to=""
              className="px-5 py-2 rounded-lg text-[13px] font-semibold tracking-wide
                         bg-amber-400 text-zinc-950 hover:bg-amber-300
                         shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:shadow-[0_0_28px_rgba(251,191,36,0.4)]
                         active:scale-95 transition-all duration-200"
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
            className="fixed top-0 left-0 z-50 w-full h-[64px] flex items-center justify-between px-5
                       bg-[#0a0a0b]/95 backdrop-blur-xl border-b border-zinc-800/60"
          >
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="../Free_Birds_Logo.png" alt="FreeBirds" className="h-10 opacity-90" />
            </Link>

            {/* Right icons + hamburger */}
            <div className="flex items-center gap-0.5">
              <Link to={`notification/${id}`} className={iconBtnCls}>
                <IoIosNotifications className="text-xl" />
              </Link>
              <Link to={`user/${id}`} className={iconBtnCls}>
                <FaUser className="text-sm" />
              </Link>
              <button onClick={handleTheme} className={iconBtnCls}>
                {theme ? <MdDarkMode className="text-base" /> : <CiLight className="text-base" />}
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
                className="fixed inset-0 z-40 bg-[#07070a] flex flex-col pt-16"
              >
                {/* Amber gradient glow top-left */}
                <div
                  className="absolute top-16 left-0 w-72 h-72 pointer-events-none opacity-[0.07]"
                  style={{
                    background: 'radial-gradient(circle at 0% 0%, #f59e0b, transparent 70%)',
                  }}
                />

                {/* Subtle grid pattern */}
                <div
                  className="absolute inset-0 opacity-[0.025] pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(251,191,36,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.3) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />

                <div className="relative flex flex-col justify-between h-full px-8 py-10">

                  {/* Nav links */}
                  <nav className="flex flex-col gap-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400/30 mb-6">
                      Navigation
                    </p>
                    {NAV_LINKS.map(({ label, to }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i + 0.1, ease: 'easeOut' }}
                      >
                        <Link
                          to={to(id ?? '')}
                          onClick={() => setMenu(true)}
                          className="flex items-center justify-between py-4 text-[22px] font-bold
                                     tracking-tight text-zinc-600 hover:text-amber-300
                                     border-b border-zinc-800/80 transition-colors duration-150
                                     group"
                        >
                          <span>{label}</span>
                          <span className="text-xs text-zinc-700 group-hover:text-amber-400/50 transition-colors duration-150">
                            →
                          </span>
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
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400/30 mb-1">
                      Account
                    </p>
                    <Link
                      to="login"
                      onClick={() => setMenu(true)}
                      className="w-full text-center py-3.5 rounded-xl text-sm font-medium tracking-wide
                                 border border-zinc-700 text-zinc-400 hover:border-amber-400/40 hover:text-amber-300
                                 transition-all duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to=""
                      onClick={() => setMenu(true)}
                      className="w-full text-center py-3.5 rounded-xl text-sm font-semibold tracking-wide
                                 bg-amber-400 text-zinc-950 hover:bg-amber-300
                                 shadow-[0_0_24px_rgba(251,191,36,0.2)]
                                 active:scale-95 transition-all duration-200"
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