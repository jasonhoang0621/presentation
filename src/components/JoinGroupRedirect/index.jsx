import { notification } from "antd";
import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAcceptInvite } from "src/api/group";

const JoinGroupRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { mutateAsync: joinGroup } = useAcceptInvite(id);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const handleAccept = async () => {
      if (token) {
        const result = await joinGroup();
        if (result?.errorCode) {
          notification.error({
            message: result?.data,
          });
          navigate(`/`);
        } else {
          notification.success({
            message: result?.data,
          });
          console.log(result.data);
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
