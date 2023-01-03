import { Input } from 'antd';
import EditMultipleChoiceAnswer from 'src/components/EditMultipleChoiceAnswer';

const MultipleChoice = ({ data, setData }) => {
  return (
    <div>
      <p className='font-semibold text-[16px] mb-1'>Your Question:</p>
      <Input
        value={data?.question}
        onChange={(e) =>
          setData({
            ...data,
            question: e.target.value
          })
        }
        className='app-input'
        placeholder='Enter question here'
        maxLength={150}
      />
      <p className='font-semibold text-[16px] mt-3'>Answers:</p>
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
