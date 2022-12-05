import { Col, Popover, Row, Select } from "antd";
import React from "react";
import SmallSlide from "./SmallSlide";
import { FileAddOutlined } from "@ant-design/icons";
import { SlideType } from "src/helpers/slide";

const EditPresentation = () => {
  const [showAddPopover, setShowAddPopover] = React.useState(false);
  const [data, setData] = React.useState([
    {
      id: 1,
      type: SlideType.MULTIPLE_CHOICE,
      content: "hello",
    },
    {
      id: 2,
      type: SlideType.MULTIPLE_CHOICE,
      content: "hello",
    },
  ]);

  const handleAddNewSlide = (type) => {
    setShowAddPopover(false);

    switch (type) {
      case SlideType.MULTIPLE_CHOICE:
        setData([
          ...data,
          {
            id: data.length + 1,
            type: SlideType.MULTIPLE_CHOICE,
            content: "",
          },
        ]);
        break;
      case SlideType.HEADING:
        setData([
          ...data,
          {
            id: data.length + 1,
            type: SlideType.HEADING,
            content: "",
          },
        ]);
        break;
      case SlideType.PARAGRAPH:
        setData([
          ...data,
          {
            id: data.length + 1,
            type: SlideType.PARAGRAPH,
            content: "",
          },
        ]);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Row gutter={[20, 20]}>
        <Col span={4}>
          <div className="bg-[#495e54] h-screen w-full p-2 pt-2 overflow-auto hide-scrollbar">
            {data.map((item, index) => (
              <div key={index}>
                <SmallSlide />
              </div>
            ))}
            <div className="flex justify-center mt-3">
              <Popover
                visible={showAddPopover}
                overlayClassName="add-popover"
                content={
                  <>
                    <p
                      onClick={() =>
                        handleAddNewSlide(SlideType.MULTIPLE_CHOICE)
                      }
                      className="py-2 px-5 border-b border-[#cecece] border-dashed hover:bg-slate-100 cursor-pointer text-[16px]"
                    >
                      Multiple Choice
                    </p>
                    <p
                      onClick={() => handleAddNewSlide(SlideType.HEADING)}
                      className="py-2 px-5 border-b border-[#cecece] border-dashed hover:bg-slate-100 cursor-pointer text-[16px]"
                    >
                      Heading
                    </p>
                    <p
                      onClick={() => handleAddNewSlide(SlideType.PARAGRAPH)}
                      className="py-2 px-5 border-b border-dashed hover:bg-slate-100 cursor-pointer text-[16px]"
                    >
                      Paragraph
                    </p>
                  </>
                }
                trigger="click"
                placement="bottomLeft"
              >
                <div
                  onClick={() => setShowAddPopover(true)}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:opacity-60 cursor-pointer"
                >
                  <FileAddOutlined color="#FFF" />
                </div>
              </Popover>
            </div>
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
