import { Form, Input, Modal, notification, Spin } from 'antd';
import React from 'react';
import { useQueryClient } from 'react-query';
import { useCreateGroup } from 'src/api/group';

const CreateGroupModal = ({ visible, setVisible }) => {
  const [form] = Form.useForm();
  const { mutateAsync, isLoading } = useCreateGroup();
  const queryClient = useQueryClient();

  const handleCreateGroup = async () => {
    const formData = form.getFieldsValue();
    const result = await mutateAsync(formData);
    if (result.errorCode) {
      notification.error({
        message: result.data || 'Create group failed'
      });
    } else {
      notification.success({
        message: 'Create group successfully'
      });
      queryClient.invalidateQueries('group');
      setVisible(false);
      form.resetFields();
    }
  };

  return (
    <Modal
      title='Create group'
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      destroyOnClose
    >
      <Spin spinning={isLoading}>
        <Form form={form} layout='vertical'>
          <Form.Item
            name='name'
            rules={[{ required: true, message: `Please input group's name!` }]}
          >
            <Input className='app-input' placeholder='Slide name' />
          </Form.Item>
          <div className='flex justify-center'>
            <button type='primary' htmltype='submit' className='button' onClick={handleCreateGroup}>
              <span>Create</span>
            </button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CreateGroupModal;
