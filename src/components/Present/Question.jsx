import React from "react";

const Question = ({ onUpVote, onDownVote, onAnswer }) => {
  const data = [
    {
      id: 1,
      name: "John Doe",
      question: "How to use React?",
      upVote: 10,
      downVote: 2,
      answer: [
        {
          id: 1,
          name: "John Doe 1",
          content: "You can use React by using create-react-app",
        },
      ],
    },
    {
      id: 1,
      name: "John Doe",
      question: "How to use React?",
      upVote: 10,
      downVote: 2,
      answer: [
        {
          id: 1,
          name: "John Doe 1",
          content: "You can use React by using create-react-app",
        },
      ],
    },
    {
      id: 1,
      name: "John Doe",
      question: "How to use React?",
      upVote: 10,
      downVote: 2,
      answer: [
        {
          id: 1,
          name: "John Doe 1",
          content: "You can use React by using create-react-app",
        },
      ],
    },
  ];
  return <div>Question</div>;
};

export default Question;
