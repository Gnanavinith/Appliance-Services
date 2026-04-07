import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { branchesApi } from '../../../api/branches.api';
import { useToast } from '../../../shared/hooks/useToast';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';

const EditBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    fetchBranchDetails();
  }, [id]);

  const fetchBranchDetails = async () => {
    try {
      setLoading(true);
      const response = await branchesApi.getBranch(id);
      
      if (response.success && response.data) {
        const branchData = response.data;
        setFormData({
          name: branchData.name || '',
          address: {
            street: branchData.address?.street || '',
            city: branchData.address?.city || '',
            state: branchData.address?.state || '',
            pincode: branchData.address?.pincode || '',
          },
          phone: branchData.phone || '',
          email: branchData.email || '',
          manager: {
            name: branchData.manager?.name || '',
            email: branchData.manager?.email || '',
            password: '',
            phone: branchData.manager?.phone || '',
          },
          operatingHours: {
            open: branchData.operatingHours?.open || '09:00',
            close: branchData.operatingHours?.close || '18:00',
            workingDays: branchData.operatingHours?.workingDays || [],
          },
          serviceAreas: branchData.serviceAreas || [],
          isActive: branchData.isActive ?? true,
        });
      }
    } catch (error) {
      console.error('❌ Fetch branch error:', error);
      toast.showError(error.message || 'Failed to load branch details');
      navigate('/admin/branches');
    } finally {
      setLoading(false);
    }
  };

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
    
    if (!formData.name.trim()) {
      toast.showError('Branch name is required');
      return;
    }
    if (!formData.phone.trim()) {
      toast.showError('Phone number is required');
      return;
    }
    if (formData.manager.email && formData.manager.password && formData.manager.password.length < 6) {
      toast.showError('Manager password must be at least 6 characters');
      return;
    }

    try {
      setSaving(true);
      console.log('✏️ Updating branch:', id);
      
      const updateData = { ...formData };
      if (!updateData.manager.password) {
        delete updateData.manager.password;
      }
      
      const response = await branchesApi.updateBranch(id, updateData);
      
      if (response.success) {
        toast.showSuccess('Branch updated successfully');
        navigate('/admin/branches');
      }
    } catch (error) {
      console.error('❌ Update branch error:', error);
      toast.showError(error.message || 'Failed to update branch');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/branches');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading branch details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={handleCancel} className="text-gray-600 hover:text-gray-900 transition">
          ← Back to Branches
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Branch</h1>
          <p className="text-gray-600 mt-1">Update branch information and credentials</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>🏢</span> Basic Information
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name *</label>
              <Input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch Phone *</label>
              <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch Email</label>
            <Input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>👤</span> Branch Manager Credentials
            <span className="text-xs text-gray-500 font-normal">(Leave password blank to keep unchanged)</span>
          </h2>
          
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manager Name</label>
                <Input type="text" name="manager.name" value={formData.manager.name} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manager Email (Login ID)</label>
                <Input type="email" name="manager.email" value={formData.manager.email} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manager Password</label>
                <Input type="password" name="manager.password" value={formData.manager.password} onChange={handleInputChange} placeholder="Enter new password or leave blank" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manager Phone</label>
                <Input type="tel" name="manager.phone" value={formData.manager.phone} onChange={handleInputChange} />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              💡 Enter a new password only if you want to change it. Leave blank to keep current password.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📍</span> Branch Address
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <Input type="text" name="street" value={formData.address.street} onChange={handleAddressChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <Input type="text" name="city" value={formData.address.city} onChange={handleAddressChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <Input type="text" name="state" value={formData.address.state} onChange={handleAddressChange} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <Input type="text" name="pincode" value={formData.address.pincode} onChange={handleAddressChange} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>🕐</span> Operating Hours
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
              <Input type="time" name="operatingHours.open" value={formData.operatingHours.open} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
              <Input type="time" name="operatingHours.close" value={formData.operatingHours.close} onChange={handleInputChange} />
            </div>
          </div>
        </div>

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

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            {saving ? 'Updating...' : 'Update Branch'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditBranch;
