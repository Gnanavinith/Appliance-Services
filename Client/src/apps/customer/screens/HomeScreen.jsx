import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Empty, Spin, Button } from 'antd';
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineHome, 
  HiOutlineWrenchScrewdriver, 
  HiOutlineStar,
  HiOutlineCalendarDays,
  HiOutlineFunnel
} from 'react-icons/hi2';
import { useServices } from '../../../queries/useServices';
import ServiceCard from '../components/ServiceCard';
import { useToast } from '../../../shared/hooks/useToast';
import { useSelector } from 'react-redux';

const { Search } = Input;
const { Option } = Select;

const HomeScreen = () => {
  const navigate = useNavigate();
  const { success, error, contextHolder } = useToast();
  
  // ALL HOOKS MUST BE AT THE TOP - DO NOT ADD ANYTHING ABOVE
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { data: servicesData, isLoading, isError } = useServices();
  
  // Extract services array from API response or use mock data
  const services = Array.isArray(servicesData?.data) ? servicesData.data : 
                   Array.isArray(servicesData) ? servicesData :
                   [
                     { id: '1', name: 'AC Repair & Service', description: 'Complete AC maintenance and repair', price: 499, category: 'cooling', rating: 4.8, image: '❄️' },
                     { id: '2', name: 'Refrigerator Repair', description: 'Fix cooling issues, gas refill', price: 399, category: 'cooling', rating: 4.7, image: '🧊' },
                     { id: '3', name: 'Washing Machine Service', description: 'Front load & top load service', price: 349, category: 'laundry', rating: 4.6, image: '👕' },
                     { id: '4', name: 'TV Repair', description: 'LED, LCD, Smart TV repair', price: 299, category: 'electronics', rating: 4.5, image: '📺' },
                     { id: '5', name: 'Microwave Repair', description: 'All brands microwave servicing', price: 249, category: 'kitchen', rating: 4.4, image: '🍳' },
                     { id: '6', name: 'Geyser Installation', description: 'Installation and repair service', price: 599, category: 'kitchen', rating: 4.9, image: '🚿' },
                   ];

  const categories = [
    { value: 'all', label: 'All Services' },
    { value: 'cooling', label: 'Cooling Appliances' },
    { value: 'laundry', label: 'Laundry Appliances' },
    { value: 'kitchen', label: 'Kitchen Appliances' },
    { value: 'electronics', label: 'Electronics' },
  ];

  const handleServiceSelect = (service) => {
    navigate('/customer/book', { 
      state: { selectedService: service } 
    });
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" description="Loading services..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {contextHolder}
      
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">👋</span>
                <div>
                  <p className="text-sm text-slate-500">Welcome back</p>
                  <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Guest'}</h2>
                </div>
              </div>
            </div>
            <Button 
              icon={<HiOutlineCalendarDays className="text-lg" />}
              onClick={() => navigate('/customer/bookings')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white border-none"
            >
              My Bookings
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 md:p-12 mb-8 shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Expert Appliance Services<br />at Your Doorstep
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-2xl">
              Book certified technicians for all your home appliances with warranty protection
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl">
              <Search
                placeholder="Search for services (e.g., AC, Washing Machine)"
                allowClear
                enterButton={<HiOutlineMagnifyingGlass className="w-5 h-5" />}
                size="large"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="shadow-lg [&_.ant-input]:rounded-xl [&_.ant-btn-primary]:rounded-xl [&_.ant-btn-primary]:bg-emerald-700"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex items-center gap-4 flex-wrap">
          <span className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <HiOutlineFunnel className="w-5 h-5" /> Filter by Category:
          </span>
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            className="min-w-[220px]"
            size="large"
            style={{ borderRadius: '12px' }}
          >
            {categories.map(cat => (
              <Option key={cat.value} value={cat.value}>{cat.label}</Option>
            ))}
          </Select>
        </div>

        {/* Services Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Available Services <span className="text-emerald-700">({filteredServices.length})</span>
          </h2>
          
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={handleServiceSelect}
                />
              ))}
            </div>
          ) : (
            <Empty 
              description="No services found matching your criteria"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-6xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Verified Professionals</h3>
              <p className="text-slate-600">Background-checked, trained technicians</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-6xl mb-4">⏱️</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">On-Time Service</h3>
              <p className="text-slate-600">Flexible scheduling, timely arrivals</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Transparent Pricing</h3>
              <p className="text-slate-600">No hidden charges, upfront quotes</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Service Warranty</h3>
              <p className="text-slate-600">90-day warranty on all repairs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
