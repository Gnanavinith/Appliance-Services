import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-16 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Mission */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <span className="text-xl font-bold tracking-tighter text-slate-900">ServiceHub</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
              The next-generation workforce management platform for professional service providers.
            </p>
          </div>

          {/* Navigation Groups */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Platform</h3>
            <div className="flex flex-col gap-3">
              {['Dashboard', 'Bookings', 'Technicians', 'Analytics'].map((item) => (
                <a key={item} href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Support</h3>
            <div className="flex flex-col gap-3">
              {['Help Center', 'API Docs', 'Status', 'Contact Us'].map((item) => (
                <a key={item} href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Social & Language */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Connect</h3>
            <div className="flex gap-4 mb-8">
              <a href="#" className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                <FaInstagram size={16} />
              </a>
              <a href="#" className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                <FaFacebookF size={16} />
              </a>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-bold text-slate-600">
              <FaGlobe size={12} className="text-slate-400" />
              English (US)
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-slate-400">
            © {new Date().getFullYear()} ServiceHub Technologies Inc.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-wider transition-colors">Privacy</a>
            <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-wider transition-colors">Terms</a>
            <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-wider transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;