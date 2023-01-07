import { Input } from 'antd';
import EditMultipleChoiceAnswer from 'src/components/EditMultipleChoiceAnswer';
import { useTranslation } from 'react-i18next';
const MultipleChoice = ({ data, setData }) => {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <p className='font-semibold text-[16px] mb-1'>{t('Your Question:')}</p>
      <Input
        value={data?.question}
        onChange={(e) =>
          setData({
            ...data,
            question: e.target.value
          })
        }
        className='app-input'
        placeholder={t('Enter question here')}
        maxLength={150}
      />
      <p className='font-semibold text-[16px] mt-3'>{t('Answers:')}</p>
      <EditMultipleChoiceAnswer
        value={data?.answer}
        onChange={(value) => {
          setData({
            ...data,
            answer: value
          });
        }}
      />
    </div>
  );
};

export default MultipleChoice;
