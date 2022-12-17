import { Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import { Reaction } from "src/helpers/slide";

const Heading = ({ data, setData }) => {
  const handleChooseReaction = (type) => {
    if (data?.icon.some((item) => item?.type === type)) {
      setData({
        ...data,
        icon: data?.icon.filter((item) => item?.type !== type),
      });
    } else {
      setData({
        ...data,
        icon: [
          ...data?.icon,
          {
            type,
            amount: 0,
          },
        ],
      });
    }
  };

  return (
    <div>
      <p className="font-semibold text-[16px] mb-1">Your Question:</p>
      <Input
        value={data?.question}
        onChange={(e) =>
          setData({
            ...data,
            question: e.target.value,
          })
        }
        className="app-input"
        placeholder="Enter question here"
        maxLength={150}
      />
      <p className="font-semibold text-[16px] mb-1 mt-3">Paragraph:</p>
      <TextArea
        value={data?.paragraph}
        onChange={(e) =>
          setData({
            ...data,
            paragraph: e.target.value,
          })
        }
        className="app-input !min-h-[150px] !max-h-[400px]"
        placeholder="Enter question here"
        maxLength={1000}
      />
      <p className="text-right">{data?.paragraph?.length}/1000</p>
      <p className="font-semibold text-[16px] mb-1 mt-3">Reaction:</p>
      <div className="flex items-center mt-2">
        {Reaction.map(({ type, Icon }) => (
          <div
            onClick={() => handleChooseReaction(type)}
            key={type}
            className={`flex items-center justify-center w-10 h-10 bg-white drop-shadow-md rounded-full mr-3 transition-all duration-200 ${
              data?.icon.some((item) => item?.type === type)
                ? "bg-[#495e54] text-white"
                : "bg-white text-gray-500"
            }}`}
          >
            <Icon
              className={`${
                data?.icon.some((item) => item?.type === type)
                  ? "text-white"
                  : "text-black"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Heading;
