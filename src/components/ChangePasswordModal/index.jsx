import { Form, Input, Modal, notification, Spin } from 'antd';
import React from 'react';
import { useChangePassword } from 'src/api/user';
import { useTranslation } from 'react-i18next';
const ChangePasswordModal = ({ visible, setVisible }) => {
  const [form] = Form.useForm();
  const { mutateAsync, isLoading } = useChangePassword();
  const { t, i18n } = useTranslation();
  const handleChangePassword = async () => {
    if (form.getFieldValue('password') === form.getFieldValue('newPassword')) {
      return notification.error({
        message: t('Change password failed'),
        description: t('New password must be different from old password')
      });
    }
    if (form.getFieldValue('newPassword') !== form.getFieldValue('rePassword')) {
      return notification.error({
        message: t('Change password failed'),
        description: t('New password and re-password must be the same')
      });
    }
    const res = await mutateAsync(form.getFieldsValue());
    if (res.errorCode) {
      notification.error({
        message: t('Change password failed'),
        description: res.data,
        duration: 1
      });
      form.resetFields();
    } else {
      notification.success({
        message: t('Change password successfully'),
        duration: 1
      });
      form.resetFields();
      setVisible(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      title={t('Change Password')}
    >
      <Spin spinning={isLoading}>
        <Form form={form} layout='vertical'>
          <Form.Item name='password'>
            <Input.Password className='app-input' placeholder={t('Current password')} />
          </Form.Item>
          <Form.Item name='newPassword'>
            <Input.Password className='app-input' placeholder={t('New password')} />
          </Form.Item>
          <Form.Item name='rePassword'>
            <Input.Password className='app-input' placeholder={t('Retype password')} />
          </Form.Item>
        </Form>
        <div className='flex items-center justify-end mt-4'>
          <button className='button button-danger mr-2' onClick={() => setVisible(false)}>
            <span className='!text-[12px]'>{t('Cancel')}</span>
          </button>
          <button className='button button-secondary' onClick={handleChangePassword}>
            <span className='!text-[12px]'>{t('Change')}</span>
          </button>
        </div>
      </Spin>
    </Modal>
  );
};

export default ChangePasswordModal;
