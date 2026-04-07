import { useAuth } from './useAuth';

export const useRole = () => {
  const { role } = useAuth();

  const hasRole = (allowedRoles) => {
    if (!role) return false;
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(role);
    }
    return role === allowedRoles;
  };

  const isCustomer = role === 'customer';
  const isTechnician = role === 'technician';
  const isBranchAdmin = role === 'branch-admin';
  const isSuperAdmin = role === 'super-admin';

  return {
    role,
    hasRole,
    isCustomer,
    isTechnician,
    isBranchAdmin,
    isSuperAdmin,
  };
};
