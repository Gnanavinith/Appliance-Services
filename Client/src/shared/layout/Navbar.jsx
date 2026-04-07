import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onLoginClick, onSignupClick }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu
  const [profileOpen, setProfileOpen] = useState(false); // Profile dropdown
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ease-in-out
        ${scrolled 
          ? 'bg-white shadow-md py-3 px-6' 
          : 'bg-white/95 backdrop-blur-sm shadow-sm py-4 px-6'}
      `}>
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">FixIt</span>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-2 items-center">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200 no-underline"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Toggle Pill */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-white transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-sm group-hover:scale-105 transition-transform">
                    {initials}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-700 leading-tight">Account</p>
                    <p className="text-[10px] text-slate-400 font-medium">Manage Profile</p>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150 origin-top-right">
                    {/* User Header */}
                    <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || 'customer@fixit.com'}</p>
                      <div className="mt-2 inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-wider">
                        {user?.role || 'Customer'}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <button 
                        onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border-none bg-transparent cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Personal Details
                      </button>
                      <button 
                         onClick={() => { navigate('/bookings'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border-none bg-transparent cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        My Bookings
                      </button>
                    </div>

                    {/* Logout Section */}
                    <div className="p-2 border-t border-slate-100 bg-slate-50/30">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-transparent border-none cursor-pointer hover:text-emerald-700 transition-all"
                >
                  Log in
                </button>
                <button
                  onClick={onSignupClick}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-700 border-none cursor-pointer shadow-lg shadow-emerald-200/50 hover:bg-emerald-800 hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                  Join Now
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className="px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 no-underline transition-colors">{label}</a>
            ))}
            <div className="h-px bg-slate-100 my-2" />
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 p-2 bg-slate-50 rounded-2xl">
                <div className="px-4 py-2">
                  <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <button onClick={() => navigate('/profile')} className="w-full py-3 rounded-xl bg-emerald-700 text-white font-bold border-none">Personal Details</button>
                <button onClick={() => navigate('/bookings')} className="w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold">My Bookings</button>
                <button onClick={handleLogout} className="w-full py-3 rounded-xl bg-white text-red-600 font-bold border border-red-100">Logout</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-2">
                <button onClick={onLoginClick} className="py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold">Login</button>
                <button onClick={onSignupClick} className="py-3 rounded-xl bg-emerald-700 text-white font-bold">Join</button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Dynamic Spacer */}
      <div className={`transition-all duration-300 ${scrolled ? 'h-[64px]' : 'h-[76px]'}`} />
    </>
  );
}