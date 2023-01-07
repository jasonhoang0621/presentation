import { notification } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAcceptInvite } from 'src/api/group';
import { useTranslation } from 'react-i18next';
const JoinGroupRedirect = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const { mutateAsync: joinGroup } = useAcceptInvite(id);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const handleAccept = async () => {
      if (token) {
        const result = await joinGroup();
        if (result?.errorCode) {
          notification.error({
            message: result?.data
          });
          navigate(`/`);
        } else {
          notification.success({
            message: 'Join group successfully'
          });
          navigate(`/group/${result?.data?.id}`);
        }
      } else {
        navigate(`/login`);
      }
    };
    if (id) {
      handleAccept();
    }
  }, [id, joinGroup, navigate]);
};

export default JoinGroupRedirect;
