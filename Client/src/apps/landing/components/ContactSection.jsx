import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaCommentDots, FaArrowRight } from 'react-icons/fa';

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
      className="inline-flex items-center gap-3 rounded-full py-2.5 pl-5 pr-3 cursor-pointer border transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
      style={{
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
        background: primary ? "#111" : "transparent",
        color: primary ? "#fff" : "#111",
        borderColor: primary ? "#111" : "rgba(0,0,0,0.18)",
      }}
    >
      <span>{label}</span>
      <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: primary ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.06)" }}>
        <FaArrowRight size={12} />
      </span>
    </button>
  );
};

const ContactSection = () => {
  const contactOptions = [
    { 
      icon: <FaPhoneAlt size={20} />, 
      title: 'Call Support', 
      info: '+91 98765 43210',
      description: 'Mon-Sun, 9am to 9pm',
      action: 'Call Now',
      accentColor: '#059669',
      accentBg: '#d1fae5',
      accentBorder: '#a7f3d0',
    },
    { 
      icon: <FaEnvelope size={20} />, 
      title: 'Email Us', 
      info: 'support@fixitpro.com',
      description: 'Response within 2 hours',
      action: 'Send Email',
      accentColor: '#d97706',
      accentBg: '#fffbeb',
      accentBorder: '#fde68a',
    },
    { 
      icon: <FaCommentDots size={20} />, 
      title: 'Live Chat', 
      info: 'Instant Support',
      description: 'Average wait: < 1 min',
      action: 'Start Chat',
      accentColor: '#111',
      accentBg: '#f9fafb',
      accentBorder: '#e5e7eb',
      isLive: true
    },
  ];

  return (
    <section id="contact" className="relative py-[110px] px-4 md:px-8 overflow-hidden" style={{ background: '#fff' }}>
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-14">
          <Tag>Contact Center</Tag>
          <h2 style={{ 
            fontSize: 'clamp(34px, 4.5vw, 62px)', 
            fontWeight: 700, 
            lineHeight: 1.06, 
            letterSpacing: '-0.03em', 
            color: '#111', 
            fontFamily: "'DM Serif Display', serif",
            marginBottom: '16px'
          }}>
            We're here to help{" "}
            <em style={{ fontStyle: 'italic', color: '#d97706' }}>whenever you need it.</em>
          </h2>
          <p className="mx-auto max-w-[480px]" style={{ fontSize: "15px", lineHeight: 1.8, color: "#6b7280" }}>
            Have a specialized request or a recurring issue? Our team is standing by to assist you.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {contactOptions.map((item, index) => (
            <div 
              key={index}
              className="group relative p-7 rounded-[20px] border transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{
                background: '#fff',
                borderColor: '#efefef',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.09)';
                e.currentTarget.style.borderColor = '#e5e5e5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = '#efefef';
              }}
            >
              {/* Top Row: Icon & Live Indicator */}
              <div className="flex justify-between items-start mb-10">
                <div
                  className="p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110"
                  style={{ background: item.accentBg }}
                >
                  <span style={{ color: item.accentColor }}>{item.icon}</span>
                </div>
                {item.isLive && (
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{ background: '#d1fae5', border: '1px solid #a7f3d0' }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#059669' }}>Online</span>
                  </div>
                )}
              </div>

              {/* Middle: Content */}
              <div className="mb-8">
                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9ca3af' }}>
                  {item.title}
                </h3>
                <div className="text-lg font-bold mb-1" style={{ color: '#111', fontFamily: "'DM Serif Display', serif" }}>
                  {item.info}
                </div>
                <p className="text-sm" style={{ color: '#6b7280' }}>{item.description}</p>
              </div>

              {/* Bottom: Action Button */}
              <PillBtn label={item.action} primary={false} />

              {/* Decorative Corner Accent */}
              <div
                className="absolute top-0 right-0 w-24 h-24 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(to bottom left, ${item.accentBg}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Support Footer */}
        <div className="text-center">
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            Looking for something else?{' '}
            <a href="#" className="font-bold underline underline-offset-4 transition-colors"
              style={{ color: '#111', textDecorationColor: '#e5e7eb' }}
              onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = '#d97706'}
              onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = '#e5e7eb'}
            >
              Visit our Help Center
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
