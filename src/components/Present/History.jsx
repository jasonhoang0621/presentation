import moment from "moment";
import React from "react";

const History = ({ data }) => {
  return (
    <div className="m-2">
      {data &&
        data.data.map((item, index) => (
          <div key={index}>
            <p className="text-center border-b border-[#495e54] border-dashed mt-3 text-[16px]">
              <span className="font-bold text-[#495e54]">
                {moment(item._id).format("DD/MM/YYYY")}
              </span>
            </p>
            {item.answer.map((record) => (
              <p
                key={record.id}
                className="text-[15px] mt-2 hover:text-[17px] hover:font-semibold transition-all duration-200"
              >
                <span className="font-bold text-[#495e54]">
                  {moment(record.createdAt).format("HH:mm")}:{" "}
                </span>
                <span className="font-bold text-[#495e54]">{record.name} </span>
                <span className="text-[#495e54]">choose </span>
                <span className="font-bold text-[#495e54]">
                  "{record.answer}"
                </span>
                <span className="text-[#495e54]"> for the question </span>
                <span className="font-bold text-[#495e54]">
                  "{record.question}"
                </span>
              </p>
            ))}
          </div>
        ))}
    </div>
  );
};

export default History;
