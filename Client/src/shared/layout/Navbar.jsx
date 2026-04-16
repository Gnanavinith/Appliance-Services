import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  HiOutlineBell, HiOutlineCalendar, HiOutlineBars3, HiOutlineXMark,
  HiOutlineUser, HiOutlineHome, HiOutlineArrowRight, HiOutlineChevronDown,
  HiOutlineBriefcase, HiOutlineCog, HiOutlineSparkles,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Support', href: '#contact' },
];

function Avatar({ initials, size = 'sm' }) {
  const cls = size === 'lg'
    ? 'w-11 h-11 text-sm'
    : size === 'md'
    ? 'w-9 h-9 text-xs'
    : 'w-[30px] h-[30px] text-[11px]';
  return (
    <div className={`${cls} rounded-full bg-orange-500 flex items-center justify-center font-bold text-white font-syne shrink-0`}>
      {initials}
    </div>
  );
}

function DropItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3.5 py-2.5 w-full text-left text-[13px] font-medium transition-colors duration-150
        ${danger
          ? 'text-red-400 hover:text-red-600 hover:bg-red-50'
          : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
        }`}
    >
      {Icon && <Icon size={15} className={danger ? 'text-red-400' : 'text-zinc-400'} />}
      {label}
    </button>
  );
}

export default function Navbar({ onLoginClick, onSignupClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const fn = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { dispatch(logout()); setProfileOpen(false); navigate('/'); };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <>
      {/* ── Announcement bar ── */}
      <div className="bg-slate-900 px-4 py-2 overflow-hidden ">
        <div className="max-w-6xl mx-auto">
          {/* Desktop: static centered */}
          <div className="hidden sm:flex items-center justify-center">
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[11.5px] text-white/70">
              <HiOutlineSparkles size={13} className="text-amber-400 shrink-0" />
              New customers get{' '}
              <button
                onClick={onSignupClick}
                className="font-bold text-amber-400 underline underline-offset-2 decoration-amber-400/50 hover:text-amber-300 transition-colors bg-transparent border-0 p-0 cursor-pointer text-[inherit]"
              >
                ₹150 off
              </button>
              {' '}first booking
              <span className="text-white/25 mx-0.5">·</span>
              <span className="inline-flex items-center gap-1">
                <span className="bg-amber-400/15 text-amber-400 tracking-wider">Verified</span>
                technicians
              </span>
              <span className="text-white/25 mx-0.5">·</span>
              Fixed pricing
              <span className="text-white/25 mx-0.5">·</span>
              30-day warranty
            </p>
          </div>
          {/* Mobile: scrolling */}
          <div className="sm:hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="inline-flex items-center gap-6 text-[11.5px] text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <HiOutlineSparkles size={13} className="text-amber-400 shrink-0" />
                  New customers get <button onClick={onSignupClick} className="font-bold text-amber-400 underline underline-offset-2 decoration-amber-400/50 bg-transparent border-0 p-0 cursor-pointer">₹150 off</button> first booking
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="bg-amber-400/15 text-amber-400 border border-amber-400/30 rounded px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider">Verified</span>
                  technicians
                </span>
                <span>Fixed pricing</span>
                <span>30-day warranty</span>
                <span className="inline-flex items-center gap-1.5">
                  <HiOutlineSparkles size={13} className="text-amber-400 shrink-0" />
                  New customers get <button onClick={onSignupClick} className="font-bold text-amber-400 underline underline-offset-2 decoration-amber-400/50 bg-transparent border-0 p-0 cursor-pointer">₹150 off</button> first booking
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="bg-amber-400/15 text-amber-400 border border-amber-400/30 rounded px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider">Verified</span>
                  technicians
                </span>
                <span>Fixed pricing</span>
                <span>30-day warranty</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <nav
        className={`sticky top-0 z-50 bg-white/[0.98] backdrop-blur-xl font-inter transition-all duration-300
          ${scrolled ? 'border-b border-zinc-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)]' : 'border-b border-zinc-100'}`}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 shrink-0 bg-transparent border-0 cursor-pointer p-0"
          >
            <div className="w-[34px] h-[34px] rounded-[9px] bg-orange-500 flex items-center justify-center">
              <HiOutlineBriefcase size={16} className="text-white" />
            </div>
            <div className="leading-none">
              <div className="font-syne text-[19px] font-extrabold text-slate-900 tracking-tight">
                Fix<span className="text-orange-500">Pro</span>
              </div>
              <div className="text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 mt-0.5">
                Service Solutions
              </div>
            </div>
          </button>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="px-4 py-2 rounded-full text-[13.5px] font-medium text-zinc-500 hover:text-slate-900 hover:bg-zinc-100 transition-all duration-150 no-underline whitespace-nowrap"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <>
                {/* Bell */}
                <button className="hidden md:flex w-9 h-9 rounded-[9px] bg-zinc-100 border border-zinc-200 text-zinc-500 hover:bg-zinc-200 hover:text-slate-900 items-center justify-center transition-all relative">
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 border-2 border-white" />
                  <HiOutlineBell size={17} />
                </button>

                {/* Book Now */}
                <button
                  onClick={() => navigate('/dashboard/book')}
                  className="hidden md:inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-semibold border-0 cursor-pointer transition-all hover:scale-[1.02] whitespace-nowrap"
                >
                  <HiOutlineCalendar size={14} />
                  Book Now
                </button>

                {/* Profile dropdown */}
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 transition-all cursor-pointer"
                  >
                    <Avatar initials={initials} size="sm" />
                    <span className="hidden md:block text-[13px] font-semibold text-slate-900">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <HiOutlineChevronDown
                      size={11}
                      className={`text-zinc-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] w-[270px] rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-[0_16px_40px_rgba(0,0,0,0.1)] z-50 animate-[drop_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                      {/* Header */}
                      <div className="flex items-center gap-3 p-3.5 bg-slate-50 border-b border-zinc-100">
                        <Avatar initials={initials} size="lg" />
                        <div>
                          <p className="font-syne text-[13.5px] font-bold text-slate-900 m-0">{user?.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 m-0">{user?.email}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 border-b border-zinc-100 bg-zinc-50">
                        {[{ val: '3', lbl: 'Active' }, { val: '12', lbl: 'Done' }, { val: '4.8', lbl: 'Rating' }].map((s, i) => (
                          <div key={s.lbl} className={`py-3 text-center ${i < 2 ? 'border-r border-zinc-100' : ''}`}>
                            <div className="font-syne text-[15px] font-bold text-orange-500">{s.val}</div>
                            <div className="text-[9.5px] text-slate-400 uppercase tracking-wider mt-0.5">{s.lbl}</div>
                          </div>
                        ))}
                      </div>

                      {/* Menu */}
                      <div className="py-1.5">
                        <DropItem icon={HiOutlineHome} label="Dashboard" onClick={() => { navigate('/dashboard'); setProfileOpen(false); }} />
                        <DropItem icon={HiOutlineCalendar} label="My Bookings" onClick={() => { navigate('/dashboard/bookings'); setProfileOpen(false); }} />
                        <DropItem icon={HiOutlineUser} label="Profile" onClick={() => { navigate('/dashboard/profile'); setProfileOpen(false); }} />
                        <DropItem icon={HiOutlineCog} label="Settings" onClick={() => { navigate('/dashboard/settings'); setProfileOpen(false); }} />
                      </div>
                      <div className="border-t border-zinc-100 py-1.5">
                        <DropItem icon={HiOutlineArrowRightOnRectangle} label="Sign out" danger onClick={handleLogout} />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="inline-flex items-center gap-1.5 px-5 h-9 rounded-full bg-transparent border border-zinc-300 text-zinc-500 hover:bg-zinc-100 hover:text-slate-900 text-[13px] font-medium cursor-pointer transition-all whitespace-nowrap"
                >
                  <HiOutlineUser size={13} />
                  Log in
                </button>
                <button
                  onClick={onSignupClick}
                  className="hidden sm:inline-flex items-center gap-1.5 px-5 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-semibold border-0 cursor-pointer transition-all hover:scale-[1.02] whitespace-nowrap"
                >
                  Get Started
                  <HiOutlineArrowRight size={13} />
                </button>
              </>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex w-9 h-9 rounded-[9px] bg-zinc-100 border border-zinc-200 text-zinc-500 hover:bg-zinc-200 hover:text-slate-900 items-center justify-center transition-all"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <HiOutlineXMark size={19} /> : <HiOutlineBars3 size={19} />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {menuOpen && (
          <div className="lg:hidden border-t border-zinc-100 bg-white animate-[mobilein_0.18s_ease-out]">
            {/* Nav links */}
            <div className="border-b border-zinc-100">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-5 py-3.5 text-[14px] font-medium text-zinc-500 hover:text-slate-900 hover:bg-slate-50 transition-all no-underline"
                >
                  {label}
                </a>
              ))}
            </div>

            <div className="p-4">
              {isAuthenticated ? (
                <>
                  {/* User card */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-200 mb-3">
                    <Avatar initials={initials} size="md" />
                    <div>
                      <p className="font-syne text-[13.5px] font-bold text-slate-900 m-0">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 m-0">{user?.role || 'Member'}</p>
                    </div>
                  </div>

                  {/* Book btn */}
                  <button
                    onClick={() => { navigate('/dashboard/book'); setMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[14px] font-semibold border-0 cursor-pointer transition-all mb-3"
                  >
                    <HiOutlineCalendar size={15} />
                    Book a Service
                  </button>

                  {/* Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: HiOutlineHome, label: 'Dashboard', to: '/dashboard' },
                      { icon: HiOutlineCalendar, label: 'Bookings', to: '/dashboard/bookings' },
                      { icon: HiOutlineUser, label: 'Profile', to: '/dashboard/profile' },
                    ].map(({ icon: Icon, label, to }) => (
                      <button
                        key={label}
                        onClick={() => { navigate(to); setMenuOpen(false); }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-[13px] font-semibold text-zinc-500 hover:bg-zinc-200 hover:text-slate-900 transition-all cursor-pointer"
                      >
                        <Icon size={15} />
                        {label}
                      </button>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-[13px] font-semibold text-red-500 hover:bg-red-100 transition-all cursor-pointer"
                    >
                      <HiOutlineArrowRightOnRectangle size={15} className="text-red-500" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={onLoginClick}
                    className="flex items-center justify-center gap-1.5 h-11 rounded-xl bg-transparent border border-zinc-300 text-zinc-500 text-[13.5px] font-medium cursor-pointer hover:bg-zinc-100 transition-all"
                  >
                    <HiOutlineUser size={14} />
                    Log in
                  </button>
                  <button
                    onClick={onSignupClick}
                    className="flex items-center justify-center gap-1.5 h-11 rounded-xl bg-slate-900 text-white text-[13.5px] font-semibold border-0 cursor-pointer hover:bg-slate-800 transition-all"
                  >
                    Sign Up
                    <HiOutlineArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Keyframes — add to your global CSS / tailwind.config */}
      <style>{`
        @keyframes drop {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes mobilein {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </>
  );
}