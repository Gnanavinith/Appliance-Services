import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineArrowRight,
  HiOutlineCheckBadge,
  HiOutlineBolt,
  HiOutlineWrench,
  HiOutlineFire,
} from 'react-icons/hi2';

const SLIDES = [
  { id: 119, label: 'AC & Cooling',     sub: 'Gas refill, repair & servicing'         },
  { id: 20,  label: 'Kitchen Appliances', sub: 'Microwave, geyser & more'            },
  { id: 26,  label: 'Laundry Care',      sub: 'Front & top load specialists'          },
  { id: 91,  label: 'Electronics',       sub: 'LED, LCD & Smart TV repair'            },
  { id: 108, label: 'Refrigerators',     sub: 'All brands, all models'               },
];

const QUICK_BOOK = [
  { name: 'AC Repair',          price: '₹499', icon: HiOutlineBolt         },
  { name: 'Refrigerator',       price: '₹399', icon: HiOutlineShieldCheck  },
  { name: 'Washing Machine',    price: '₹349', icon: HiOutlineClock        },
  { name: 'TV Repair',          price: '₹299', icon: HiOutlineStar         },
  { name: 'Microwave',          price: '₹249', icon: HiOutlineFire         },
  { name: 'Geyser',             price: '₹599', icon: HiOutlineWrench       },
];

const STATS = [
  { val: '5L+',  label: 'Customers Served' },
  { val: '20+',  label: 'Cities'            },
  { val: '4.8',  label: 'Star Rating'       },
  { val: '98%',  label: 'On-time Rate'      },
];

/* ─── PILL BUTTON ─── */
const PillBtn = ({ label, primary = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-3 rounded-full py-3 pl-6 pr-3 cursor-pointer border transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
      style={{
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        background: primary ? "#111" : "transparent",
        color: "#fff",
        borderColor: primary ? "#111" : "rgba(255,255,255,0.3)",
      }}
    >
      <span>{label}</span>
      <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: primary ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.1)" }}>
        <HiOutlineArrowRight size={12} />
      </span>
    </button>
  );
};

/* ─── MAIN ─── */
export default function HeroSection({ onCtaClick }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCur((c) => (c + 1) % SLIDES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleBook = () => isAuthenticated ? navigate('/customer') : onCtaClick();

  return (
    <div className="relative overflow-hidden" style={{ background: '#0f172a' }}>
      <style>{`
        @keyframes heroUp { from { opacity: 0; transform: translateY(36px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        .hero-word {
          display: inline-block;
          opacity: 0;
          transform: translateY(28px);
          animation: heroUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .pulse-dot {
          animation: pulse 2.2s ease-in-out infinite;
        }

        .float-it {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={`https://picsum.photos/id/${SLIDES[cur].id}/1920/1080`}
          alt="Hero Background"
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
      </div>

      <div className="relative z-10" style={{ minHeight: '100vh', paddingTop: '140px', paddingBottom: '96px' }}>
        <div className="w-full px-[5%]">
          <div className="max-w-[940px]">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 mb-7" style={{ animation: 'heroUp 0.7s 0.1s both' }}>
              <span className="pulse-dot w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
              <span style={{ fontSize: 'clamp(10px, 3vw, 12px)', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#fbbf24' }}>
                Expert Appliance Repair Services
              </span>
            </div>

            {/* BIG headline */}
            <h1 style={{ 
              fontSize: 'clamp(36px, 10vw, 104px)', 
              fontWeight: 900, 
              lineHeight: 1.0, 
              letterSpacing: '-0.035em', 
              margin: '0 0 28px',
              fontFamily: "'DM Serif Display', serif"
            }}>
              <span className="block text-white">
                {'Expert Appliance'.split(' ').map((w, i) => (
                  <span key={i} className="hero-word" style={{ animationDelay: `${0.18 + i * 0.09}s` }}>{w}&nbsp;</span>
                ))}
              </span>
              <span className="block text-white">
                {'Repair at'.split(' ').map((w, i) => (
                  <span key={i} className="hero-word" style={{ animationDelay: `${0.34 + i * 0.09}s` }}>{w}&nbsp;</span>
                ))}
              </span>
              <span className="block" style={{ color: '#fbbf24', fontStyle: 'italic' }}>
                {'Your Doorstep'.split(' ').map((w, i) => (
                  <span key={i} className="hero-word" style={{ animationDelay: `${0.52 + i * 0.09}s` }}>{w}&nbsp;</span>
                ))}
              </span>
            </h1>

            {/* Subtext */}
            <p style={{ 
              fontSize: 'clamp(14px, 4vw, 18px)', 
              lineHeight: 'clamp(1.5, 5vw, 1.75)', 
              color: 'rgba(255,255,255,0.85)', 
              maxWidth: 'min(520px, 90%)', 
              marginBottom: 'clamp(30px, 6vw, 40px)', 
              animation: 'heroUp 0.7s 0.78s both' 
            }}>
              Professional repair services for all home appliances. Verified technicians, transparent pricing, and 30-day warranty on every service call.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-3 flex-wrap pill-row" style={{ animation: 'heroUp 0.7s 0.9s both' }}>
              <PillBtn label="Book a Service" primary={true} onClick={handleBook} />
              <PillBtn label="How It Works" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} />
            </div>
          </div>
        </div>

        {/* Floating stat card */}
        <div className="float-it absolute bottom-[96px] right-[5%] z-10 rounded-2xl py-5 px-6 hidden md:block"
          style={{ 
            background: 'rgba(255,255,255,0.96)', 
            border: '1px solid rgba(0,0,0,0.07)', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            animation: 'float 6s ease-in-out infinite, fadeIn 1s 0.65s both' 
          }}>
          <div style={{ fontSize: 'clamp(28px, 6vw, 38px)', fontWeight: 700, lineHeight: 1, color: '#111', fontFamily: "'DM Serif Display', serif" }}>
            4.8 <span style={{ fontSize: 'clamp(11px, 3vw, 15px)', fontWeight: 400, color: '#aaa' }}>/5</span>
          </div>
          <div style={{ fontSize: 'clamp(8px, 2.5vw, 9px)', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#bbb', marginTop: '4px' }}>
            Customer Rating
          </div>
        </div>
      </div>

      {/* ── Quick Booking Bar ── */}
      <div className="relative z-10 border-b py-3 overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)' }}>
        <div className="w-full px-[5%]">
          <div className="flex gap-2 whitespace-nowrap overflow-x-auto text-white/40" style={{ fontSize: '11px' }}>
            {QUICK_BOOK.map((service, i) => (
              <button
                key={i}
                onClick={handleBook}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <service.icon size={12} />
                <span className="whitespace-nowrap" style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  {service.name} · {service.price}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trust Indicators ── */}
      <div className="relative z-10 py-12" style={{ background: 'rgba(15,23,42,0.9)' }}>
        <div className="w-full px-[5%]">
          <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={s.label} className="text-center" style={{ animation: `fadeUp 0.6s ${0.1 * i}s both` }}>
                <p style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, lineHeight: 1, color: '#fbbf24', fontFamily: "'DM Serif Display', serif" }}>
                  {s.val}
                </p>
                <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
