import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaWind, FaSnowflake, FaTint, FaTv, FaMicrochip, FaShower, FaArrowRight 
} from 'react-icons/fa';

const ServicesSection = ({ onServiceClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const services = [
    { icon: <FaWind />, name: 'AC Repair & Service', price: '₹499', desc: 'Repair, installation & maintenance', color: 'text-blue-500', category: 'cooling' },
    { icon: <FaSnowflake />, name: 'Refrigerator Repair', price: '₹399', desc: 'All brands & models', color: 'text-cyan-500', category: 'cooling' },
    { icon: <FaTint />, name: 'Washing Machine Service', price: '₹349', desc: 'Front & top load service', color: 'text-indigo-500', category: 'laundry' },
    { icon: <FaTv />, name: 'TV Repair', price: '₹299', desc: 'LED, LCD & Smart TV', color: 'text-purple-500', category: 'electronics' },
    { icon: <FaMicrochip />, name: 'Microwave Repair', price: '₹249', desc: 'Installation & repair', color: 'text-amber-500', category: 'kitchen' },
    { icon: <FaShower />, name: 'Geyser Installation', price: '₹599', desc: 'Installation & servicing', color: 'text-orange-500', category: 'kitchen' },
  ];

  const handleServiceSelect = (service) => {
    if (isAuthenticated) {
      // Pass complete service data with name as ID for backend matching
      navigate('/customer/book', { 
        state: { 
          selectedService: {
            id: service.name.toLowerCase().replace(/\s+/g, '-'), // e.g., 'ac-repair-service'
            name: service.name,
            price: service.price.replace('₹', ''),
            description: service.desc,
            category: service.category,
          } 
        } 
      });
    } else {
      onServiceClick(service);
    }
  };

  return (
    <section id="services" className="relative py-32 px-6 bg-white overflow-hidden">
      {/* Background Grid Pattern (Matching Hero) */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>

      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="max-w-2xl text-left">
            <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase mb-3 block">
              Premium Solutions
            </span>
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter text-slate-900 leading-tight">
              Maintenance built <br /> for the <span className="text-slate-400">modern home.</span>
            </h2>
          </div>
          <p className="text-slate-500 text-lg max-w-sm mb-2">
            Professional repair services delivered by certified experts. Fixed pricing, no hidden costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-slate-100">
          {services.map((service, index) => (
            <div 
              key={index}
              onClick={() => handleServiceSelect(service)}
              className="group relative p-10 bg-white border-r border-b border-slate-100 transition-all duration-500 hover:bg-slate-50/50 cursor-pointer overflow-hidden"
            >
              {/* Hover Accent Glow */}
              <div className="absolute -inset-px bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className={`text-2xl mb-8 p-3 w-fit rounded-xl bg-slate-50 group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm transition-all duration-500 ${service.color}`}>
                  {service.icon}
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{service.name}</h3>
                  <div className="text-sm font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-colors">
                    {service.price}
                  </div>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-[220px]">
                  {service.desc}
                </p>

                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Book Service <FaArrowRight className="text-xs" />
                </div>
              </div>

              {/* Bottom Decorative Bar */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-emerald-600 transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
        
        {/* Trusted Partners / Badge area */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-10 opacity-30 grayscale pointer-events-none">
            <span className="font-black text-2xl italic tracking-tighter text-slate-900">SAMSUNG</span>
            <span className="font-black text-2xl italic tracking-tighter text-slate-900">LG</span>
            <span className="font-black text-2xl italic tracking-tighter text-slate-900">WHIRLPOOL</span>
            <span className="font-black text-2xl italic tracking-tighter text-slate-900">DAIKIN</span>
            <span className="font-black text-2xl italic tracking-tighter text-slate-900">PANASONIC</span>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;