import { Form, Input, Modal, notification } from 'antd';
import { t } from 'i18next';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { useCreatePresentation } from 'src/api/presentation';
import { useTranslation } from 'react-i18next';
const CreatePresentationModal = ({ visible, setVisible }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { mutateAsync } = useCreatePresentation();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  const handleCreatePresentation = async () => {
    if (!id) return notification.error({ message: t('Group id is required') });
    const formData = form.getFieldsValue();
    formData.groupId = id;
    const result = await mutateAsync(formData);
    if (result.errorCode) {
      notification.error({
        message: result.data || t('Create group failed')
      });
    } else {
      notification.success({
        message: t('Create group successfully')
      });
      queryClient.invalidateQueries(['presentation', id]);
      setVisible(false);
      form.resetFields();
    }
  };

  return (
    <Modal
      title={t('Create Presentation')}
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout='vertical'>
        <Form.Item
          name='name'
          rules={[{ required: true, message: t('Please input presetation name!') }]}
        >
          <Input className='app-input' placeholder={t('Presentation name')} />
        </Form.Item>
        <div className='flex justify-center'>
          <button
            type='primary'
            htmltype='submit'
            className='button'
            onClick={handleCreatePresentation}
          >
            <span>{t('Create')}</span>
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreatePresentationModal;
