import { useSelector, useDispatch } from 'react-redux';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, role, isAuthenticated, token, loading, error } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    role,
    isAuthenticated,
    token,
    loading,
    error,
    dispatch,
  };
};
