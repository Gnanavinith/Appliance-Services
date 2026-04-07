import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { branchesApi } from '../../../api/branches.api';
import { useToast } from '../../../shared/hooks/useToast';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';

const CreateBranch = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
    phone: '',
    email: '',
    manager: {
      name: '',
      email: '',
      password: '',
      phone: '',
    },
    operatingHours: {
      open: '09:00',
      close: '18:00',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    serviceAreas: [],
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Form submitted - Starting validation');
    console.log('📋 Form data:', formData);
    
    // Validation
    if (!formData.name.trim()) {
      console.error('❌ Validation failed: Branch name is required');
      toast.error('Branch name is required');
      return;
    }
    if (!formData.phone.trim()) {
      console.error('❌ Validation failed: Phone number is required');
      toast.error('Phone number is required');
      return;
    }
    // Validate manager credentials
    if (formData.manager.email && !formData.manager.password) {
      console.error('❌ Validation failed: Manager password required with email');
      toast.error('Manager password is required when providing manager email');
      return;
    }

    try {
      setLoading(true);
      console.log('➕ Creating new branch with data:', JSON.stringify(formData, null, 2));
      const response = await branchesApi.createBranch(formData);
      console.log('📡 API Response:', response);
      
      if (response.success) {
        console.log('✅ Branch created successfully, navigating to /admin/branches');
        toast.success('Branch created successfully');
        navigate('/admin/branches');
      } else {
        console.error('❌ API returned success=false:', response);
        toast.error(response.message || 'Failed to create branch');
      }
    } catch (error) {
      console.error('❌ Create branch error:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || error.message || 'Failed to create branch');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/branches');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleCancel}
          className="text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Branches
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Branch</h1>
          <p className="text-gray-600 mt-1">Add a new branch location to your network</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>🏢</span> Basic Information
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter branch name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Phone *
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
            />
          </div>
        </div>

        {/* Branch Manager Credentials */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>👤</span> Branch Manager Credentials
            <span className="text-xs text-gray-500 font-normal">(Optional - for branch admin access)</span>
          </h2>
          
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager Name
                </label>
                <Input
                  type="text"
                  name="manager.name"
                  value={formData.manager.name}
                  onChange={handleInputChange}
                  placeholder="Manager full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager Email (Login ID)
                </label>
                <Input
                  type="email"
                  name="manager.email"
                  value={formData.manager.email}
                  onChange={handleInputChange}
                  placeholder="manager@branch.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager Password
                </label>
                <Input
                  type="password"
                  name="manager.password"
                  value={formData.manager.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager Phone
                </label>
                <Input
                  type="tel"
                  name="manager.phone"
                  value={formData.manager.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit phone number"
                />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              💡 These credentials will allow the branch manager to login and manage technicians at this branch.
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📍</span> Branch Address
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street
              </label>
              <Input
                type="text"
                name="street"
                value={formData.address.street}
                onChange={handleAddressChange}
                placeholder="Enter street address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <Input
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  placeholder="State"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <Input
                type="text"
                name="pincode"
                value={formData.address.pincode}
                onChange={handleAddressChange}
                placeholder="Pincode"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>🕐</span> Operating Hours
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Time
              </label>
              <Input
                type="time"
                name="operatingHours.open"
                value={formData.operatingHours.open}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Closing Time
              </label>
              <Input
                type="time"
                name="operatingHours.close"
                value={formData.operatingHours.close}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-gray-700">Active Branch</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            htmlType="button"
            variant="secondary" 
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            htmlType="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
            onClick={() => console.log('🔘 Submit button clicked!')}
          >
            {loading ? 'Creating Branch...' : 'Create Branch'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBranch;
