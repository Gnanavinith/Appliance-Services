import React from 'react';
import { FaMobileAlt, FaUserCheck, FaShieldAlt } from 'react-icons/fa';

const HowItWorksSection = () => {
  const steps = [
    { 
      icon: <FaMobileAlt size={28} />, 
      title: 'Book Online', 
      desc: 'Select your appliance and schedule a time that fits your day.',
      badge: 'Step 01'
    },
    { 
      icon: <FaUserCheck size={28} />, 
      title: 'Expert Arrives', 
      desc: 'A background-verified technician arrives with all the right tools.',
      badge: 'Step 02'
    },
    { 
      icon: <FaShieldAlt size={28} />, 
      title: 'Service & Warranty', 
      desc: 'Enjoy a 30-day post-service warranty on all repairs.',
      badge: 'Step 03'
    },
  ];

  return (
    <section id="how-it-works" className="relative py-32 px-6 bg-slate-50/50">
      {/* Subtle Grid (matching previous sections) */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-30"></div>

      <div className="max-w-[1100px] mx-auto text-center">
        <div className="mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-slate-900 mb-4">
            Simple. Transparent. <span className="text-emerald-600">Reliable.</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            We’ve streamlined the repair process so you can get back to your life without the stress of broken appliances.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
          {/* Decorative Dashed Line (Hidden on mobile) */}
          <div className="hidden md:block absolute top-24 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-slate-200 -z-0"></div>

          {steps.map((item, index) => (
            <div key={index} className="group relative z-10 flex flex-col items-center">
              {/* Step Indicator Badge */}
              <div className="mb-6 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-colors duration-300 shadow-sm">
                {item.badge}
              </div>

              {/* Icon Container */}
              <div className="relative mb-8 w-20 h-20 rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm group-hover:shadow-xl group-hover:border-emerald-500/20 group-hover:-translate-y-2 transition-all duration-500">
                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-500"></div>
                {item.icon}
              </div>

              {/* Text Content */}
              <div className="max-w-[280px]">
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Mobile Line Indicator */}
              {index !== steps.length - 1 && (
                <div className="md:hidden w-px h-12 bg-slate-200 my-4"></div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Footer for Section */}
        <div className="mt-24 inline-flex items-center gap-6 p-2 pl-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
          <span className="text-white text-sm font-medium">Ready to experience the difference?</span>
          <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all active:scale-95">
            Book Appointment
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;