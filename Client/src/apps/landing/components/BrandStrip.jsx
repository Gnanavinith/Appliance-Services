import React from 'react';

const BRANDS = [
  'SAMSUNG', 'LG', 'WHIRLPOOL', 'DAIKIN', 'PANASONIC', 'BOSCH',
  'SAMSUNG', 'LG', 'WHIRLPOOL', 'DAIKIN', 'PANASONIC', 'BOSCH',
];

export default function BrandStrip() {
  return (
    <div
      className="mt-4 md:mt-6 rounded-[20px] px-6 md:px-8 py-5 md:py-6 overflow-hidden"
      style={{ background:'#fff', border:'1px solid #efefef' }}
    >
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center mb-4 md:mb-5" style={{ color:'#9ca3af' }}>
        Trusted by India's leading brands
      </p>
      
      {/* Infinity scroll container */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #fff 0%, transparent 100%)' }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #fff 0%, transparent 100%)' }}
        />
        
        {/* Scrolling brands */}
        <div 
          className="flex items-center gap-8 md:gap-12 animate-scroll"
          style={{ width: 'max-content' }}
        >
          {BRANDS.map((brand, index) => (
            <span 
              key={`${brand}-${index}`} 
              className="text-lg md:text-2xl font-black tracking-tight whitespace-nowrap"
              style={{ 
                color:'#111',
                opacity: 0.5,
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                letterSpacing: '-0.02em',
                transition: 'opacity 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
