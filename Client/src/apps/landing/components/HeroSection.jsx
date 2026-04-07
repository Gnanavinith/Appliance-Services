import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HeroSection = ({ onCtaClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLearnMore = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookNow = () => {
    if (isAuthenticated) {
      // Redirect to customer dashboard where they can select a service
      navigate('/customer');
    } else {
      onCtaClick();
    }
  };

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-16 md:pt-16 lg:pt-24 lg:pb-40">
      {/* Modern Grid Background - Scaled for mobile */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] md:[background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Content Block */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge - Centered on mobile */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs md:text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Available in 20+ Cities
            </div>
            
            {/* Title - Smaller on mobile */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter text-slate-900 mb-6 leading-[1.1]">
              Expert Appliance <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Services at Your Door
              </span>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-slate-500 mb-8 md:mb-10 max-w-[540px] mx-auto lg:mx-0 leading-relaxed">
              Book certified technicians for AC, refrigerator, washing machine & more. 
              Experience high-quality maintenance with a 30-day warranty.
            </p>
            
            {/* Action Buttons - Stacks on small mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-12 md:mb-16">
              <button
                onClick={handleBookNow}
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-200"
              >
                Book a Service — It's Free
              </button>
              <button
                onClick={handleLearnMore}
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 active:scale-95 transition-all"
              >
                How it works
              </button>
            </div>

            {/* Stats Row - Responsive layout */}
            <div className="flex flex-row justify-center lg:justify-start gap-4 sm:gap-8 items-center border-t border-slate-100 pt-8">
              <div className="flex-1 sm:flex-none">
                <div className="text-xl md:text-2xl font-bold text-slate-900">50K+</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Customers</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex-1 sm:flex-none">
                <div className="text-xl md:text-2xl font-bold text-slate-900">10K+</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Techs</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex-1 sm:flex-none">
                <div className="text-xl md:text-2xl font-bold text-slate-900 flex items-center justify-center lg:justify-start gap-1">
                  4.9<span className="text-emerald-500 text-base md:text-lg">★</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Rating</div>
              </div>
            </div>
          </div>

          {/* Visual Block - Smaller on mobile */}
          <div className="relative group order-1 lg:order-2 max-w-[500px] mx-auto w-full">
            <div className="absolute -top-6 -right-6 w-32 h-32 md:w-64 md:h-64 bg-emerald-100/50 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 md:w-64 md:h-64 bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
            
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 shadow-xl lg:shadow-2xl transition-transform duration-500 lg:group-hover:scale-[1.02]">
              <img 
                src="https://picsum.photos/id/119/800/1000" 
                alt="Professional Technician" 
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover grayscale-[0.2] lg:group-hover:grayscale-0 transition-all duration-700"
              />
              
              {/* Floating Badge Card - Adjusted padding for mobile */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-4 md:p-6 bg-white/90 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl shadow-xl">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-bold text-slate-900">Certified Technicians Only</div>
                    <div className="text-[10px] md:text-xs text-slate-500 leading-tight">Verified professionals with 5+ years experience.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;