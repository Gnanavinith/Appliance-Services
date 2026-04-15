import React from 'react';
import {
  HiOutlineDevicePhoneMobile,
  HiOutlineIdentification,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
  HiOutlineStar,
  HiOutlineArrowRight,
  HiOutlineClock,
  HiOutlineBolt,
  HiOutlineCheckBadge,
} from 'react-icons/hi2';

const STEPS = [
  {
    icon: HiOutlineDevicePhoneMobile,
    num: '01',
    title: 'Book Online in 60 Seconds',
    desc: 'Select your appliance type, pick a time slot that suits you, and confirm — no advance payment required.',
    points: ['No advance payment needed', 'Instant SMS confirmation', 'Reschedule anytime'],
    accent: '#d97706',
    accentBg: '#fffbeb',
    accentBorder: '#fde68a',
  },
  {
    icon: HiOutlineIdentification,
    num: '02',
    title: 'Verified Expert Arrives',
    desc: 'A background-checked, certified technician arrives at your doorstep within the chosen window.',
    points: ['ID-verified professional', 'Carries all required tools', 'Wears FixIt uniform'],
    accent: '#111',
    accentBg: '#f9fafb',
    accentBorder: '#e5e7eb',
  },
  {
    icon: HiOutlineShieldCheck,
    num: '03',
    title: 'Service Done & Warranted',
    desc: 'Pay only after the work is complete and you are satisfied. Every repair comes with a 30-day warranty.',
    points: ['Pay after service only', '30-day warranty included', 'Digital invoice sent'],
    accent: '#059669',
    accentBg: '#d1fae5',
    accentBorder: '#a7f3d0',
  },
];

const METRICS = [
  { val:'4.8', label:'Average Rating',  sub:'Out of 5.0',       icon: HiOutlineStar         },
  { val:'98%', label:'On-time Arrival', sub:'Across all cities', icon: HiOutlineClock        },
  { val:'5L+', label:'Jobs Completed',  sub:'Since 2019',        icon: HiOutlineCheckBadge   },
  { val:'30',  label:'Day Warranty',    sub:'On every repair',   icon: HiOutlineShieldCheck  },
];

const REVIEWS = [
  {
    name: 'Priya M.', city: 'Chennai', rating: 5,
    text: 'Technician arrived within 2 hours, fixed our AC, and explained the issue clearly. Outstanding service.',
    service: 'AC Repair',
  },
  {
    name: 'Rahul K.', city: 'Bangalore', rating: 5,
    text: 'Washing machine repaired in under 30 minutes. Fair pricing and very professional. Will recommend.',
    service: 'Washing Machine',
  },
  {
    name: 'Sunita R.', city: 'Mumbai', rating: 4,
    text: 'Booked online and got a confirmation instantly. The technician was courteous and skilled.',
    service: 'Refrigerator Repair',
  },
];

/* ─── TAG ─── */
const Tag = ({ children }) => (
  <div className="inline-flex items-center gap-2 mb-5">
    <div className="w-7 h-[2px] rounded-full bg-amber-500" />
    <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#d97706" }}>
      {children}
    </span>
  </div>
);

/* ─── PILL BUTTON ─── */
const PillBtn = ({ label, primary = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-3 rounded-full py-3 pl-6 pr-3 cursor-pointer border transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
      style={{
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
        background: primary ? "#111" : "transparent",
        color: primary ? "#fff" : "#fff",
        borderColor: primary ? "#fff" : "rgba(255,255,255,0.25)",
      }}
    >
      <span>{label}</span>
      <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: primary ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)" }}>
        <HiOutlineArrowRight size={12} />
      </span>
    </button>
  );
};

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" style={{ background:'#fff' }} className="py-[110px] px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto">

        {/* ── Section header ── */}
        <div className="text-center mb-14">
          <Tag>How It Works</Tag>
          <h2 style={{ 
            fontSize: 'clamp(34px, 4.5vw, 62px)', 
            fontWeight: 700, 
            lineHeight: 1.06, 
            letterSpacing: '-0.03em', 
            color: '#111', 
            fontFamily: "'DM Serif Display', serif",
            marginBottom: '16px'
          }}>
            Three steps to a repaired appliance{" "}
            <em style={{ fontStyle: 'italic', color: '#d97706' }}>simple, transparent, guaranteed</em>
          </h2>
        </div>

        {/* ── Steps ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="rounded-[20px] overflow-hidden transition-all duration-300"
                style={{
                  background:'#fff',
                  border:`1px solid #efefef`,
                  boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.09)';
                  e.currentTarget.style.borderColor = '#e5e5e5';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  e.currentTarget.style.borderColor = '#efefef';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Top accent bar */}
                <div className="h-1" style={{ background: step.accent }} />

                <div className="p-6">
                  {/* Icon + step num */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: step.accentBg, border:`1px solid ${step.accentBorder}` }}
                    >
                      <Icon style={{ color: step.accent, fontSize:22 }} />
                    </div>
                    <span
                      className="text-4xl font-bold leading-none"
                      style={{ color:'#f3f4f6', letterSpacing:'-0.04em', fontFamily:"'DM Serif Display', serif" }}
                    >
                      {step.num}
                    </span>
                  </div>

                  <h3
                    className="text-base font-bold mb-2"
                    style={{ color:'#111', letterSpacing:'-0.015em', fontFamily:"'DM Serif Display', serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color:'#6b7280' }}>
                    {step.desc}
                  </p>

                  <div
                    className="space-y-2.5 pt-5"
                    style={{ borderTop:'1px solid #f3f4f6' }}
                  >
                    {step.points.map((pt) => (
                      <div key={pt} className="flex items-center gap-2.5 text-xs font-medium" style={{ color:'#374151' }}>
                        <HiOutlineCheckCircle style={{ color: step.accent, fontSize:14, flexShrink:0 }} />
                        {pt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Metrics row ── */}
        <div
          className="rounded-[20px] px-8 py-8 grid grid-cols-2 md:grid-cols-4 mb-12"
          style={{ background:'#f9fafb', border:'1px solid #efefef', boxShadow:'0 4px 20px rgba(0,0,0,0.04)' }}
        >
          {METRICS.map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="text-center px-4 py-2"
                style={{ borderLeft: i > 0 ? '1px solid #e5e7eb' : 'none' }}
              >
                <div className="flex items-center justify-center mb-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background:'#fffbeb' }}
                  >
                    <Icon style={{ color:'#d97706', fontSize:16 }} />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1" style={{ color:'#111', letterSpacing:'-0.025em', fontFamily:"'DM Serif Display', serif" }}>
                  {m.val}
                </p>
                <p className="text-xs font-bold" style={{ color:'#374151' }}>{m.label}</p>
                <p className="text-[10px] mt-1" style={{ color:'#9ca3af' }}>{m.sub}</p>
              </div>
            );
          })}
        </div>

        {/* ── Reviews ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="rounded-[20px] p-6"
              style={{ background:'#fff', border:'1px solid #efefef', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, si) => (
                  <HiOutlineStar
                    key={si}
                    style={{ color: si < r.rating ? '#fbbf24' : '#e5e7eb', fontSize:14 }}
                  />
                ))}
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color:'#374151' }}>
                "{r.text}"
              </p>

              <div
                className="flex items-center justify-between pt-5"
                style={{ borderTop:'1px solid #f3f4f6' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white"
                    style={{ background:'#111' }}
                  >
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color:'#111' }}>{r.name}</p>
                    <p className="text-[10px]" style={{ color:'#9ca3af' }}>{r.city}</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full"
                  style={{ background:'#d1fae5', color:'#059669', border:'1px solid #a7f3d0' }}
                >
                  <HiOutlineCheckCircle style={{ fontSize:11 }} />
                  Verified
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA banner ── */}
        <div
          className="rounded-[20px] overflow-hidden"
          style={{ background:'#111' }}
        >
          <div className="px-[5%] py-[80px]">
            <div className="max-w-[740px]">
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "96px", fontWeight: 700, lineHeight: 0.6, color: "rgba(255,255,255,0.06)", marginBottom: "16px", userSelect: "none" }}>"</div>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px,3.8vw,46px)", fontWeight: 700, fontStyle: "italic", lineHeight: 1.28, letterSpacing: "-0.025em", color: "rgba(255,255,255,0.82)", marginBottom: "24px" }}>
                Ready to get your<br />appliance fixed?
              </p>
              <p className="text-gray-400 mb-9" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                Free diagnostic visit · Pay after service · 30-day warranty on all repairs
              </p>
              <div className="flex gap-3 flex-wrap">
                <PillBtn label="Book Now — Free Visit" primary={true} />
                <PillBtn label="View All Services" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
