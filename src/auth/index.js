import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useProfile } from 'src/api/user';
import { login } from 'src/redux/auth';

const Authenticate = ({ children }) => {
  const { data } = useProfile();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (data) {
      dispatch(login(data?.data));
      localStorage.setItem('token', data?.data?.token);
      localStorage.setItem('refreshToken', data?.data?.refreshToken);
      localStorage.setItem('userId', data?.data?.id);
    }
  }, [data, dispatch]);
  return children;
};

export default Authenticate;
