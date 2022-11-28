import { Form, Input, Modal, notification } from "antd";
import { useForm } from "antd/lib/form/Form";
import React from "react";
import { useChangePassword } from "src/api/user";
const ChangePasswordModal = ({ visible, setVisible }) => {
  const [form] = useForm();
  const { mutateAsync } = useChangePassword();

  const handleChangePassword = async () => {
    if (form.getFieldValue("password") === form.getFieldValue("newPassword")) {
      return notification.error({
        message: "Change password failed",
        description: "New password must be different from old password",
      });
    }
    if (
      form.getFieldValue("newPassword") !== form.getFieldValue("rePassword")
    ) {
      return notification.error({
        message: "Change password failed",
        description: "New password and re-password must be the same",
      });
    }
    const res = await mutateAsync(form.getFieldsValue());
    if (res.errorCode) {
      notification.error({
        message: "Change password failed",
        description: res.data,
        duration: 1,
      });
    } else {
      notification.success({
        message: "Change password successfully",
        duration: 1,
      });
      setVisible(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      title="Change Password"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="password">
          <Input.Password
            className="app-input"
            placeholder="Current password"
          />
        </Form.Item>
        <Form.Item name="newPassword">
          <Input.Password className="app-input" placeholder="New password" />
        </Form.Item>
        <Form.Item name="rePassword">
          <Input.Password className="app-input" placeholder="Retype password" />
        </Form.Item>
        <div className="flex items-center justify-end mt-4">
          <button
            className="button button-danger mr-2"
            onClick={() => setVisible(false)}
          >
            <span className="!text-[12px]">Cancel</span>
          </button>
          <button
            className="button button-secondary"
            onClick={handleChangePassword}
          >
            <span className="!text-[12px]">Change</span>
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
