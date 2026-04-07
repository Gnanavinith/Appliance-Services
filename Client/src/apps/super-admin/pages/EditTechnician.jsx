import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { useToast } from '../../../shared/hooks/useToast';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';

const EditTechnician = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  // Fetch technician data if editing
  const { data: technicianData, isLoading: loadingTechnician } = useQuery({
    queryKey: ['technician', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/technicians/${id}`);
      return response.data;
    },
    enabled: isEditMode,
  });

  // Populate form data when editing
  React.useEffect(() => {
    if (technicianData?.data && isEditMode) {
      const tech = technicianData.data;
      setFormData({
        name: tech.name || '',
        email: tech.email || '',
        phone: tech.phone || '',
        password: '',
        address: {
          street: tech.address?.street || '',
          city: tech.address?.city || '',
          state: tech.address?.state || '',
          pincode: tech.address?.pincode || '',
        },
      });
    }
  }, [technicianData, isEditMode]);

  // Save technician mutation
  const saveTechnician = useMutation({
    mutationFn: async (data) => {
      if (isEditMode) {
        const response = await axiosInstance.put(`/technicians/${id}`, data);
        return response.data;
      } else {
        const response = await axiosInstance.post('/technicians', data);
        return response.data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['technicians']);
      toast.success(isEditMode ? 'Technician updated successfully' : 'Technician created successfully');
      navigate('/admin/technicians');
    },
    onError: (error) => {
      console.error('Save technician error:', error);
      toast.error(error.response?.data?.message || 'Failed to save technician');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isEditMode && !formData.password) {
      toast.error('Password is required for new technicians');
      return;
    }

    // Validate phone number length
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    saveTechnician.mutate(formData);
  };

  const handleCancel = () => {
    navigate('/admin/technicians');
  };

  if (loadingTechnician) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading technician details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleCancel}
          className="text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Technicians
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Technician' : 'Add New Technician'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode 
              ? 'Update technician information' 
              : 'Create a new technician account and assign to branches'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>👤</span> Basic Information
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="technician@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="10-digit phone number"
                required
                maxLength="10"
              />
            </div>
            {!isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  required={!isEditMode}
                />
              </div>
            )}
          </div>

          {isEditMode && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                💡 <strong>Note:</strong> To change the password, please contact the system administrator. 
                Email cannot be changed once created.
              </p>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📍</span> Address
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street
              </label>
              <Input
                type="text"
                value={formData.address.street}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
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
                  value={formData.address.city}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <Input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
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
                value={formData.address.pincode}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })}
                placeholder="Pincode"
              />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="text-sm font-semibold text-blue-900">After Creating Technician</h3>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li>• The technician will be able to login with their email and password</li>
                <li>• You can assign them to branches from the Technicians list page</li>
                <li>• Branch admins can then manage technician assignments</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            htmlType="button"
            variant="secondary" 
            onClick={handleCancel}
            disabled={saveTechnician.isPending}
          >
            Cancel
          </Button>
          <Button 
            htmlType="submit"
            variant="primary"
            loading={saveTechnician.isPending}
            disabled={saveTechnician.isPending}
          >
            {saveTechnician.isPending 
              ? (isEditMode ? 'Updating...' : 'Creating...') 
              : (isEditMode ? 'Update Technician' : 'Create Technician')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditTechnician;
