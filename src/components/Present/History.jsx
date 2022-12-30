import moment from "moment";
import React from "react";

const History = () => {
  const data = [
    {
      date: "2021-09-01",
      data: [
        {
          id: 1,
          name: "Jame",
          action: 'pick answer "Answer 1"',
          createdAt: "2021-09-01 12:55:00",
        },
        {
          id: 2,
          name: "Jame",
          action: 'pick answer "Answer 2"',
          createdAt: "2021-09-01 12:00:00",
        },
      ],
    },
    {
      date: "2021-09-04",
      data: [
        {
          id: 3,
          name: "Jame",
          action: 'pick answer "Answer 1"',
          createdAt: "2021-09-04 12:55:00",
        },
        {
          id: 4,
          name: "Jame",
          action:
            'pick answer "Answer 2" Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
          createdAt: "2021-09-04 12:00:00",
        },
        {
          id: 4,
          name: "Jame",
          action:
            'pick answer "Answer 2" Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
          createdAt: "2021-09-04 12:00:00",
        },
        {
          id: 4,
          name: "Jame",
          action:
            'pick answer "Answer 2" Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
          createdAt: "2021-09-04 12:00:00",
        },
        {
          id: 3,
          name: "Jame",
          action: 'pick answer "Answer 1"',
          createdAt: "2021-09-04 12:55:00",
        },
      ],
    },
  ];
  return (
    <div className="m-2">
      {data &&
        data.map((item, index) => (
          <div key={index}>
            <p className="text-center border-b border-[#495e54] border-dashed mt-3 text-[16px]">
              <span className="font-bold">
                {moment(item.date).format("DD/MM/YYYY")}
              </span>
            </p>
            {item.data.map((record) => (
              <p
                key={record.id}
                className="text-[15px] mt-2 hover:text-[17px] hover:font-semibold transition-all duration-200"
              >
                <span className="font-bold text-[#495e54]">{record.name} </span>
                {record.action} at{" "}
                <span className="font-bold text-[#495e54]">
                  {moment(record.createdAt).format("HH:mm")}
                </span>
              </p>
            ))}
          </div>
        ))}
    </div>
  );
};

export default History;
