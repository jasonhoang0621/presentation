import React from "react";
import { SlideType } from "src/helpers/slide";

const Present = () => {
  const data = {
    id: 1,
    type: SlideType.MULTIPLE_CHOICE,
    question: "What is your favorite color?",
    answers: [
      "Red",
      "Blue",
      "Green",
      "Yellow",
      "Red",
      "Blue",
      "Green",
      "Yellow",
    ],
  };

  const [activeAnswer, setActiveAnswer] = React.useState(null);

  return (
    <div style={{ height: "calc(100vh - 64px)" }}>
      <p className="text-center text-2xl mt-5">{data?.question}</p>
      <div className="mt-10 flex flex-wrap">
        {data?.answers.map((answer, index) => (
          <div
            key={index}
            className={`app-input text-center w-[32%] mx-auto cursor-pointer ${
              activeAnswer === index ? "bg-[#495e54] text-white" : "bg-white"
            }`}
            onClick={() => setActiveAnswer(index)}
          >
            {answer}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Present;
