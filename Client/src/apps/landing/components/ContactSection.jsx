import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaCommentDots, FaArrowRight } from 'react-icons/fa';

const ContactSection = () => {
  const contactOptions = [
    { 
      icon: <FaPhoneAlt size={20} />, 
      title: 'Call Support', 
      info: '+91 98765 43210',
      description: 'Mon-Sun, 9am to 9pm',
      action: 'Call Now',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      icon: <FaEnvelope size={20} />, 
      title: 'Email Us', 
      info: 'support@servicehub.com',
      description: 'Response within 2 hours',
      action: 'Send Email',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      icon: <FaCommentDots size={20} />, 
      title: 'Live Chat', 
      info: 'Instant Support',
      description: 'Average wait: < 1 min',
      action: 'Start Chat',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      isLive: true
    },
  ];

  return (
    <section id="contact" className="relative py-32 px-6 bg-white overflow-hidden">
      {/* Signature Grid Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>

      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              Contact Center
            </span>
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter text-slate-900 leading-[1.1]">
              We’re here to help <br />
              <span className="text-slate-400 font-medium italic">whenever you need it.</span>
            </h2>
          </div>
          <p className="text-slate-500 text-lg max-w-[320px]">
            Have a specialized request or a recurring issue? Our team is standing by to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactOptions.map((item, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-3xl border border-slate-200 bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 overflow-hidden"
            >
              {/* Top Row: Icon & Live Indicator */}
              <div className="flex justify-between items-start mb-12">
                <div className={`p-4 rounded-2xl ${item.bg} ${item.color} transition-transform duration-500 group-hover:scale-110`}>
                  {item.icon}
                </div>
                {item.isLive && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Online</span>
                  </div>
                )}
              </div>

              {/* Middle: Content */}
              <div className="mb-8">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">{item.title}</h3>
                <div className="text-xl font-bold text-slate-900 tracking-tight mb-1">{item.info}</div>
                <p className="text-slate-500 text-sm">{item.description}</p>
              </div>

              {/* Bottom: Action Button */}
              <button className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:gap-3 transition-all duration-300">
                {item.action} <FaArrowRight className="text-xs text-slate-300 group-hover:text-slate-900 transition-colors" />
              </button>

              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-50 to-transparent -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Support Footer */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm">
            Looking for something else? <a href="#" className="text-slate-900 font-bold underline underline-offset-4 decoration-slate-200 hover:decoration-emerald-500 transition-all">Visit our Help Center</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;