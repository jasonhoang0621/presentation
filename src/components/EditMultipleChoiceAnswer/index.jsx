import { Input } from "antd";
import React from "react";
import { DeleteOutlined, AppstoreAddOutlined } from "@ant-design/icons";

const EditMultipleChoiceAnswer = ({ value, onChange }) => {
  const handleAdd = () => {
    const newValue = [...value];
    newValue.push(`Answer ${newValue.length + 1}`);
    onChange(newValue);
  };

  const handleDelete = (index) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div>
      {value &&
        value.map((item, index) => {
          return (
            <div key={index} className="flex items-center gap-x-2">
              <Input
                type="text"
                value={item}
                className="app-input"
                onChange={(e) => {
                  const newValue = [...value];
                  newValue[index] = e.target.value;
                  onChange(newValue);
                }}
              />
              <div
                className="cursor-pointer flex items-center text-[20px]"
                onClick={handleDelete}
              >
                <DeleteOutlined className="text-[#495e54] hover:text-[#ff0000] transition-all duration-200" />
              </div>
            </div>
          );
        })}
      <div className="flex justify-center mt-5 hover:opacity-80 transition-all duration-200">
        <div
          className="cursor-pointer bg-[#495e54] w-8 h-8 flex items-center justify-center rounded-full"
          onClick={handleAdd}
        >
          <AppstoreAddOutlined className="text-white text-[18px] transition-all duration-200" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditMultipleChoiceAnswer);
