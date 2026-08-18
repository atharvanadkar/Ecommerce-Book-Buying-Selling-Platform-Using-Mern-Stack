import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutAsync } from '../AuthSlice';

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = async () => {
      // Clear everything first
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Call API
      try {
        await dispatch(logoutAsync()).unwrap();
      } catch (error) {
        console.error('Logout error:', error);
      }
      
      // Force redirect with replace
      window.location.replace('/login');
    };

    handleLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default Logout;