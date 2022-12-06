import { Input } from "antd";
import EditMultipleChoiceAnswer from "src/components/EditMultipleChoiceAnswer";

const MultipleChoice = ({ data, setData }) => {
  return (
    <div>
      <Input
        value={data?.question}
        onChange={(e) => {
          setData({
            ...data,
            question: e.target.value,
          });
        }}
        className="app-input"
        placeholder="Enter question here"
      />
      <EditMultipleChoiceAnswer
        value={data?.answers}
        onChange={(value) => {
          setData({
            ...data,
            answers: value,
          });
        }}
      />
    </div>
  );
};

export default MultipleChoice;
