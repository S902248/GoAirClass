import AdminRoutes from './routes/AdminRoutes';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function AdminApp() {
  const { isDarkMode } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <AdminRoutes />
  );
}

export default AdminApp;
