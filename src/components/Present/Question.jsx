import React from "react";
import { QuestionOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
const Question = ({ data, handleUpVote, onAnswer }) => {
  const auth = useSelector((state) => state.auth);

  return (
    <div className="m-2">
      {data &&
        data.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <div className="flex justify-between">
              <div className="flex mr-5">
                <div className="w-10 h-10 rounded-full bg-[#495e54] flex items-center justify-center flex-none">
                  <span className="text-white font-bold text-xl flex items-center justify-center">
                    <QuestionOutlined />
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-[#495e54] font-bold">{item?.name}</p>
                  <p className="text-[#495e54] text-sm">{item?.question}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-7 h-7 rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 ${
                    item?.upVote.includes(auth?.user?.id)
                      ? "bg-[#495e54]"
                      : "bg-white border-2 border-[#495e54] hover:opacity-75"
                  }`}
                >
                  <ArrowUpOutlined
                    className={`text-[16px] font-bold ${
                      item?.upVote.includes(auth?.user?.id)
                        ? "text-white"
                        : "text-[#495e54]"
                    }`}
                    onClick={() => handleUpVote(item?.id)}
                  />
                </div>
                <p className="text-[#495e54] font-bold ml-2">
                  {item?.upVote.length}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[#495e54] font-bold">Answers</p>
              {item?.answer &&
                item.answer.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center mt-3 border-b 
                  border-[#495e54] pb-2 border-dashed
                  "
                  >
                    <div>
                      <p className="text-[#495e54] font-bold">{item?.name}</p>
                      <p className="text-[#495e54] text-sm">{item?.content}</p>
                    </div>
                  </div>
                ))}
            </div>
            {/* <div className="mt-4">
            <button
              onClick={() => onAnswer(item.id)}
              className="bg-[#495e54] text-white px-4 py-2 rounded-lg"
            >
              Answer
            </button>
          </div> */}
          </div>
        ))}
    </div>
  );
};

export default Question;
