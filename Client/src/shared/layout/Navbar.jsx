import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { 
  HiOutlineBell, 
  HiOutlineCalendar, 
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineUser,
  HiOutlineHome,
  HiOutlineArrowRight,
  HiOutlineChevronDown,
  HiOutlineBriefcase,
  HiOutlineCog,
  HiOutlineLifebuoy,
  HiOutlineSparkles,
  HiOutlineArrowRightOnRectangle
} from 'react-icons/hi2';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Support', href: '#contact' },
];

const GLOBAL_CSS = `
  @keyframes nv-drop {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes nv-mobile-in {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .nv-desktop-links { display: none !important; }
  .nv-bell { display: none !important; }
  .nv-book-btn { display: none !important; }
  .nv-username { display: none !important; }
  .nv-cta-btn { display: none !important; }
  .nv-hamburger { display: flex !important; }

  @media (min-width: 640px) { .nv-cta-btn { display: inline-flex !important; } }
  @media (min-width: 768px) { .nv-bell { display: flex !important; } .nv-book-btn { display: inline-flex !important; } .nv-username { display: block !important; } }
  @media (min-width: 1024px) { .nv-desktop-links { display: flex !important; } .nv-hamburger { display: none !important; } }
`;

const iconBtnStyle = {
  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#f4f4f5', border: '1px solid #e4e4e7',
  color: '#52525b', cursor: 'pointer', transition: 'all .2s',
  position: 'relative',
};

const ctaBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '0 20px', height: 38, borderRadius: 999,
  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700,
  color: '#fff', background: '#0f172a',
  border: '1px solid transparent', cursor: 'pointer', transition: 'all .2s',
  whiteSpace: 'nowrap', letterSpacing: '0.01em',
};

const loginBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '0 20px', height: 38, borderRadius: 999,
  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
  color: '#3f3f46', background: 'transparent',
  border: '1px solid #d4d4d8', cursor: 'pointer', transition: 'all .2s',
  whiteSpace: 'nowrap',
};

const profileBtnStyle = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '4px 12px 4px 4px', borderRadius: 12,
  background: '#f4f4f5', border: '1px solid #e4e4e7',
  cursor: 'pointer', transition: 'all .2s',
};

function Avatar({ initials, size, radius }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: 'linear-gradient(135deg, #f97316, #ea580c)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Syne', sans-serif",
      fontSize: size * 0.35, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function NavLink({ label, href }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '7px 16px', borderRadius: 999,
      fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500,
      color: hov ? '#0f172a' : '#52525b',
      background: hov ? '#f4f4f5' : 'transparent',
      textDecoration: 'none', transition: 'all .2s', whiteSpace: 'nowrap',
    }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {label}
    </a>
  );
}

function DropItem({ icon: Icon, label, onClick, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px', width: '100%', textAlign: 'left',
      fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500,
      color: danger ? (hov ? '#dc2626' : '#ef4444') : (hov ? '#0f172a' : '#52525b'),
      background: hov ? (danger ? '#fef2f2' : '#f4f4f5') : 'transparent',
      border: 'none', cursor: 'pointer', transition: 'all .15s',
    }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {Icon && <Icon size={16} style={{ color: danger ? '#ef4444' : '#a1a1aa' }} />}
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
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fn = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setProfileOpen(false);
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
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href={FONT_URL} rel="stylesheet" />
      <style>{GLOBAL_CSS}</style>

      {/* Announcement bar */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        padding: '8px 20px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <HiOutlineSparkles size={14} color="#fbbf24" />
          New customers get{' '}
          <button onClick={onSignupClick} style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontWeight: 700, color: '#fbbf24', fontFamily: 'inherit', fontSize: 'inherit',
            textDecoration: 'underline', textDecorationColor: 'rgba(251,191,36,0.5)',
          }}>
            ₹150 off
          </button>
          {' '}first booking — verified technicians · fixed pricing · 30-day warranty
        </p>
      </div>

      {/* Main navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        background: scrolled ? 'rgba(255,255,255,0.98)' : '#ffffff',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? '#e4e4e7' : '#f0f0f0'}`,
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.06)' : 'none',
        transition: 'box-shadow .3s, border-color .3s',
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 24px', height: 66,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 16,
        }}>

          {/* Professional Logo */}
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <HiOutlineBriefcase size={18} color="#fff" />
            </div>
            <div style={{ lineHeight: 1 }}>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em',
              }}>
                Fix<span style={{ color: '#f97316' }}>Pro</span>
              </div>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#64748b', marginTop: 2,
              }}>
                Service Solutions
              </div>
            </div>
          </button>

          {/* Desktop nav links */}
          <div className="nv-desktop-links" style={{
            flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4,
          }}>
            {NAV_LINKS.map(({ label, href }) => (
              <NavLink key={label} label={label} href={href} />
            ))}
          </div>

          {/* Right section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

            {isAuthenticated ? (
              <>
                {/* Bell notification */}
                <button className="nv-bell" style={iconBtnStyle}
                  aria-label="Notifications"
                  onMouseEnter={e => Object.assign(e.currentTarget.style, { background: '#e4e4e7', color: '#0f172a' })}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { background: '#f4f4f5', color: '#52525b' })}
                >
                  <span style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#f97316', border: '2px solid #fff',
                  }} />
                  <HiOutlineBell size={18} />
                </button>

                {/* Book Now */}
                <button className="nv-book-btn" style={ctaBtnStyle}
                  onClick={() => navigate('/dashboard/book')}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <HiOutlineCalendar size={16} />
                  Book Now
                </button>

                {/* Profile dropdown */}
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                  <button
                    style={profileBtnStyle}
                    onClick={() => setProfileOpen(!profileOpen)}
                    onMouseEnter={e => e.currentTarget.style.background = '#e4e4e7'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f4f4f5'}
                  >
                    <Avatar initials={initials} size={30} radius="50%" />
                    <span className="nv-username" style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13, fontWeight: 600, color: '#0f172a',
                    }}>
                      {user?.name?.split(' ')[0]}
                    </span>
                    <HiOutlineChevronDown size={12} style={{ color: '#a1a1aa', transition: 'transform .22s ease', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </button>

                  {profileOpen && (
                    <div style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                      width: 280, borderRadius: 16, overflow: 'hidden',
                      background: '#ffffff',
                      border: '1px solid #e4e4e7',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                      animation: 'nv-drop .22s cubic-bezier(.16,1,.3,1)',
                      zIndex: 100,
                    }}>
                      {/* Header */}
                      <div style={{
                        padding: '16px', display: 'flex', alignItems: 'center', gap: 12,
                        background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                        borderBottom: '1px solid #e4e4e7',
                      }}>
                        <Avatar initials={initials} size={44} radius="50%" />
                        <div>
                          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                            {user?.name}
                          </p>
                          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: '#94a3b8', margin: '3px 0 0' }}>
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
                        borderBottom: '1px solid #f1f5f9',
                        background: '#fafafa',
                      }}>
                        {[{ val: '3', lbl: 'Active' }, { val: '12', lbl: 'Done' }, { val: '4.8', lbl: 'Rating' }].map((s, i) => (
                          <div key={s.lbl} style={{
                            padding: '12px 0', textAlign: 'center',
                            borderRight: i < 2 ? '1px solid #f1f5f9' : 'none',
                          }}>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: '#f97316' }}>{s.val}</div>
                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2 }}>{s.lbl}</div>
                          </div>
                        ))}
                      </div>

                      {/* Menu items */}
                      <div style={{ padding: '6px 0' }}>
                        <DropItem icon={HiOutlineHome} label="Dashboard" onClick={() => { navigate('/dashboard'); setProfileOpen(false); }} />
                        <DropItem icon={HiOutlineCalendar} label="My Bookings" onClick={() => { navigate('/dashboard/bookings'); setProfileOpen(false); }} />
                        <DropItem icon={HiOutlineUser} label="Profile" onClick={() => { navigate('/dashboard/profile'); setProfileOpen(false); }} />
                        <DropItem icon={HiOutlineCog} label="Settings" onClick={() => { navigate('/dashboard/settings'); setProfileOpen(false); }} />
                      </div>

                      <div style={{ borderTop: '1px solid #f1f5f9', padding: '6px 0' }}>
                        <DropItem icon={HiOutlineArrowRightOnRectangle} label="Sign out" danger onClick={handleLogout} />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button style={loginBtnStyle} onClick={onLoginClick}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f4f4f5'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = '#d4d4d8'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3f3f46'; e.currentTarget.style.borderColor = '#d4d4d8'; }}
                >
                  <HiOutlineUser size={14} />
                  Log in
                </button>

                <button className="nv-cta-btn" style={ctaBtnStyle} onClick={onSignupClick}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  Get Started
                  <HiOutlineArrowRight size={14} />
                </button>
              </>
            )}

            {/* Hamburger */}
            <button className="nv-hamburger" style={iconBtnStyle}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onMouseEnter={e => { e.currentTarget.style.background = '#e4e4e7'; e.currentTarget.style.color = '#0f172a'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f4f4f5'; e.currentTarget.style.color = '#52525b'; }}
            >
              {menuOpen ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid #f1f5f9',
            background: '#ffffff',
            animation: 'nv-mobile-in .2s ease-out',
          }}>
            {/* Nav links */}
            <div style={{ borderBottom: '1px solid #f1f5f9' }}>
              {NAV_LINKS.map(({ label, href }) => (
                <a key={label} href={href} onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 24px', textDecoration: 'none',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14, fontWeight: 500, color: '#52525b',
                    transition: 'all .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#52525b'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {label}
                </a>
              ))}
            </div>

            <div style={{ padding: 16 }}>
              {isAuthenticated ? (
                <>
                  {/* User card */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 14, marginBottom: 12,
                    background: '#fff7ed', border: '1px solid #fed7aa',
                  }}>
                    <Avatar initials={initials} size={44} radius="50%" />
                    <div>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>{user?.name}</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#94a3b8', margin: '3px 0 0' }}>{user?.role || 'Member'}</p>
                    </div>
                  </div>

                  <button style={{ ...ctaBtnStyle, width: '100%', justifyContent: 'center', height: 44, marginBottom: 12, borderRadius: 12 }}
                    onClick={() => { navigate('/dashboard/book'); setMenuOpen(false); }}>
                    <HiOutlineCalendar size={16} />
                    Book a Service
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <button
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '11px 14px', borderRadius: 12, width: '100%',
                        fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                        color: '#3f3f46', background: '#f4f4f5',
                        border: '1px solid #e4e4e7', cursor: 'pointer', transition: 'all .15s',
                      }}
                      onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#e4e4e7'; e.currentTarget.style.color = '#0f172a'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f4f4f5'; e.currentTarget.style.color = '#3f3f46'; }}
                    >
                      <HiOutlineHome size={16} />
                      Dashboard
                    </button>
                    <button
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '11px 14px', borderRadius: 12, width: '100%',
                        fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                        color: '#3f3f46', background: '#f4f4f5',
                        border: '1px solid #e4e4e7', cursor: 'pointer', transition: 'all .15s',
                      }}
                      onClick={() => { navigate('/dashboard/bookings'); setMenuOpen(false); }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#e4e4e7'; e.currentTarget.style.color = '#0f172a'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f4f4f5'; e.currentTarget.style.color = '#3f3f46'; }}
                    >
                      <HiOutlineCalendar size={16} />
                      Bookings
                    </button>
                    <button
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '11px 14px', borderRadius: 12, width: '100%',
                        fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                        color: '#3f3f46', background: '#f4f4f5',
                        border: '1px solid #e4e4e7', cursor: 'pointer', transition: 'all .15s',
                      }}
                      onClick={() => { navigate('/dashboard/profile'); setMenuOpen(false); }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#e4e4e7'; e.currentTarget.style.color = '#0f172a'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f4f4f5'; e.currentTarget.style.color = '#3f3f46'; }}
                    >
                      <HiOutlineUser size={16} />
                      Profile
                    </button>
                    <button
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '11px 14px', borderRadius: 12, width: '100%',
                        fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                        color: '#ef4444', background: '#fef2f2',
                        border: '1px solid #fecaca', cursor: 'pointer', transition: 'all .15s',
                      }}
                      onClick={handleLogout}
                      onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
                    >
                      <HiOutlineArrowRightOnRectangle size={16} />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button style={{ ...loginBtnStyle, height: 46, justifyContent: 'center', borderRadius: 12 }} onClick={onLoginClick}>
                    <HiOutlineUser size={14} />
                    Log in
                  </button>
                  <button style={{ ...ctaBtnStyle, height: 46, justifyContent: 'center', borderRadius: 12 }} onClick={onSignupClick}>
                    Sign Up
                    <HiOutlineArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}