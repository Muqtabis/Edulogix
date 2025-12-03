import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    } else if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  return null;
};

export default Login;
