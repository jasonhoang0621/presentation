import { Form, Input, Modal, Spin } from 'antd';
import React from 'react';
import { useEditProfile } from 'src/api/user';
import { notification } from 'antd';
import { useQueryClient } from 'react-query';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
const ProfileModal = ({ visible, setVisible }) => {
  const { t, i18n } = useTranslation();
  const auth = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const { mutateAsync, isLoading } = useEditProfile();
  const queryClient = useQueryClient();

  const handleChangeProfile = async () => {
    const formData = form.getFieldsValue();
    delete formData.email;
    const res = await mutateAsync(formData);
    if (res.errorCode) {
      notification.error({
        message: t('Edit failed'),
        description: res.data,
        duration: 1
      });
    } else {
      notification.success({
        message: t('Edit successfully'),
        duration: 1
      });
      queryClient.invalidateQueries('group');
      queryClient.invalidateQueries('profile');
      setVisible(false);
    }
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        email: auth.user?.email,
        name: auth.user?.name
      });
    }
  }, [auth, form, visible]);

  return (
    <div>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        title={t('Profile')}
      >
        <Spin spinning={isLoading}>
          <Form form={form} layout='vertical'>
            <Form.Item name='email'>
              <Input
                className='app-input bg-gray-300 !cursor-not-allowed'
                placeholder={t('Email')}
                readOnly
              />
            </Form.Item>
            <Form.Item name='name'>
              <Input className='app-input' placeholder={t('Name')} />
            </Form.Item>
          </Form>
          <div className='flex items-center justify-end mt-4'>
            <button className='button button-danger mr-2' onClick={() => setVisible(false)}>
              <span className='!text-[12px]'>{t('Cancel')}</span>
            </button>
            <button className='button button-secondary' onClick={handleChangeProfile}>
              <span className='!text-[12px]'>{t('Change')}</span>
            </button>
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default ProfileModal;
