import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RedirectByEmail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (userId) {
      const id = localStorage.getItem('userId');
      if (id === userId) {
        navigate('/');
        return;
      }
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
      return;
    }
    navigate('/login');
  }, [userId, navigate]);

  return <></>;
};

export default RedirectByEmail;
