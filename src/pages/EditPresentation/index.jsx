import { Col, Row } from "antd";
import React from "react";
import SmallSlide from "./SmallSlide";

const EditPresentation = () => {
  const data = [1, 2, 4, 4, 5, 6, 35, 6, 6, 7, 8, 9];

  return (
    <div>
      <Row gutter={[20, 20]}>
        <Col span={4}>
          <div className="bg-[#495e54] h-screen w-full p-2 pt-0 overflow-auto hide-scrollbar">
            {data.map((item, index) => (
              <div key={index}>
                <SmallSlide />
              </div>
            ))}
          </div>
        </Col>
        <Col span={12}>
          <div className="bg-white shadow-lg w-full h-[450px] rounded-[8px] p-5 my-5">
            hello
          </div>
        </Col>
        <Col span={8}>
          <div className="bg-white h-full p-1">hello</div>
        </Col>
      </Row>
    </div>
  );
};

export default EditPresentation;
