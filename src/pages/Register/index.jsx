import { Form, Input, notification, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import { Link, useNavigate } from "react-router-dom";
import { getGoogleLink, useRegister } from "src/api/user";
import FacebookIcon from "src/assets/images/facebook.png";
import GoogleIcon from "src/assets/images/google.png";

const Register = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const { mutateAsync, isLoading } = useRegister();

  const handleRegister = async () => {
    const res = await mutateAsync(form.getFieldsValue());
    if (res.errorCode) {
      notification.error({
        message: "Login failed",
        description: res.data.message || "Login failed",
        duration: 1,
      });
    } else {
      navigate("/login");
    }
  };

  const handleRedirectGoogle = async () => {
    const res = await getGoogleLink();
    if (!res.errorCode) {
      window.location.href = res.data;
    }
  };

  return (
    <Spin spinning={isLoading}>
      <div className="flex justify-center items-center h-screen bg-[#495E54]">
        <div className="shadow-2xl rounded-lg p-8 bg-white bg-opacity-50 backdrop-filter backdrop-blur-sm">
          <div className="flex justify-center mb-5">
            <p className="text-[40px] font-semibold uppercase">Register</p>
          </div>
          <Form form={form} onFinish={handleRegister} className="w-[500px]">
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input className="app-input" placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input className="app-input" placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password className="app-input" placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="rePassword"
              rules={[
                {
                  required: true,
                  message: "Please input your retype-password!",
                },
              ]}
            >
              <Input.Password
                className="app-input"
                placeholder="Retype-password"
              />
            </Form.Item>
            <div className="flex justify-center">
              <button type="primary" htmltype="submit" className="button">
                <span>Register</span>
              </button>
            </div>
          </Form>
          <div className="flex items-center justify-center mt-5">
            <span
              className="rounded-[50%] overflow-hidden cursor-pointer hover:opacity-60"
              onClick={handleRedirectGoogle}
            >
              <img src={GoogleIcon} alt="" className="w-[50px] h-[50px]" />
            </span>
            <span className="rounded-[50%] overflow-hidden ml-5 cursor-not-allowed">
              <img src={FacebookIcon} alt="" className="w-[50px] h-[50px]" />
            </span>
          </div>
          <div className="text-center mt-5">
            <p>
              Or{" "}
              <Link
                to="/login"
                className="text-[#495E54] cursor-pointer hover:text-white"
              >
                You Already Have An Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default Register;
