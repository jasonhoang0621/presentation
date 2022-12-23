import { Form, Input, notification, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import { Link, useNavigate } from "react-router-dom";
import { useForgotPassword } from "src/api/user";

const ForgetPassword = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const { mutateAsync, isLoading } = useForgotPassword();

  const handleLogin = async () => {
    const res = await mutateAsync(form.getFieldsValue());
    console.log(res);

    if (res?.errorCode) {
      notification.error({
        message: "Reset password failed",
        description: res.data,
        duration: 1,
      });
    }
    notification.success({
      message: "Reset password success",
      description: res?.data,
      duration: 1,
    })
    navigate("/login");
  };

  return (
    <Spin spinning={isLoading}>
      <div className="flex justify-center items-center h-screen bg-[#495E54]">
        <div className="shadow-2xl rounded-lg p-8 bg-white bg-opacity-50 backdrop-filter backdrop-blur-sm">
          <div className="flex justify-center mb-5">
            <p className="text-[40px] font-semibold uppercase">
              Forget Password
            </p>
          </div>
          <Form form={form} onFinish={handleLogin} className="w-[500px]">
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input className="app-input" placeholder="Email" />
            </Form.Item>
            <div className="flex justify-center">
              <button type="primary" htmltype="submit" className="button">
                <span>Next</span>
              </button>
            </div>
          </Form>

          <div className="text-center mt-5">
            <Link
              to="/login"
              className="text-[#495E54] cursor-pointer hover:text-white"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default ForgetPassword;
