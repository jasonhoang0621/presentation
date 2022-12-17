import { notification } from "antd";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLoginGoogle } from "src/api/user";

const GoogleRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutateAsync } = useLoginGoogle();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      const handleLoginGoogle = async () => {
        const res = await mutateAsync({ code });
        if (res.errorCode) {
          notification.error({
            message: "Login failed",
            description: res.data.message || "Login failed",
            duration: 1,
          });
        } else {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          navigate("/");
        }
      };
      handleLoginGoogle();
    } else {
      notification.error({
        description: "Login failed",
        duration: 1,
      });
      navigate("/login");
    }
  }, [searchParams, navigate, mutateAsync]);
};

export default GoogleRedirect;
