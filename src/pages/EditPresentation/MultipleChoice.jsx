import { Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import React from "react";
import { useEffect } from "react";
import EditMultipleChoiceAnswer from "src/components/EditMultipleChoiceAnswer";

const MultipleChoice = ({ data }) => {
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue({
      question: data?.question,
      answers: data?.answers || ["Answer 1", "Answer 2"],
    });
  }, [data, form]);

  return (
    <Form form={form} layout="vertical" className="multiple-question">
      <Form.Item
        name="question"
        label="Your Question"
        rules={[
          {
            required: true,
            message: "Please input question!",
          },
        ]}
      >
        <Input className="app-input" placeholder="Enter question here" />
      </Form.Item>
      <Form.Item name="answers" label="Answers">
        <EditMultipleChoiceAnswer />
      </Form.Item>
    </Form>
  );
};

export default MultipleChoice;
