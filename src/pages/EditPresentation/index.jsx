import { FileAddOutlined } from "@ant-design/icons";
import { Col, Popover, Row } from "antd";
import React from "react";
import { SlideType } from "src/helpers/slide";
import MultipleChoice from "./MultipleChoice";
import SmallSlide from "./SmallSlide";

const EditPresentation = () => {
  const [showAddPopover, setShowAddPopover] = React.useState(false);
  const [data, setData] = React.useState([
    {
      id: 1,
      type: SlideType.MULTIPLE_CHOICE,
      question: "hello",
      answers: [],
    },
    {
      id: 2,
      type: SlideType.MULTIPLE_CHOICE,
      question: "okokoko",
      answers: [],
    },
  ]);

  const [activeSlide, setActiveSlide] = React.useState(data ? data[0] : null);

  const handleAddNewSlide = (type) => {
    setShowAddPopover(false);
    switch (type) {
      case SlideType.MULTIPLE_CHOICE:
        setData([
          ...data,
          {
            id: data.length + 1,
            type: SlideType.MULTIPLE_CHOICE,
            question: "",
          },
        ]);
        break;
      case SlideType.HEADING:
        setData([
          ...data,
          {
            id: data.length + 1,
            type: SlideType.HEADING,
            question: "",
          },
        ]);
        break;
      case SlideType.PARAGRAPH:
        setData([
          ...data,
          {
            id: data.length + 1,
            type: SlideType.PARAGRAPH,
            question: "",
          },
        ]);
        break;
      default:
        break;
    }
  };

  const handleDeleteSlide = (deleteSlide) => {
    setData(data.filter((item) => item.id !== deleteSlide));
  };

  const handleEditQuestion = (value) => {
    const newData = data.map((item) => {
      if (item.id === activeSlide.id) {
        return {
          ...item,
          ...value,
        };
      }
      return item;
    });
    setData(newData);
    setActiveSlide(newData.find((item) => item.id === activeSlide.id));
  };

  const addSlideMenu = (
    <div>
      <p
        onClick={() => handleAddNewSlide(SlideType.MULTIPLE_CHOICE)}
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
    </div>
  );

  return (
    <div>
      <Row gutter={[20, 20]} className="edit-presentation">
        <Col span={4}>
          <div className="bg-white h-screen w-full pt-1.5 overflow-auto hide-scrollbar">
            {data.map((item, index) => (
              <div key={index}>
                <SmallSlide
                  index={index}
                  data={item}
                  handleDeleteSlide={handleDeleteSlide}
                  activeSlide={activeSlide}
                  setActiveSlide={setActiveSlide}
                />
              </div>
            ))}
            <div className="flex justify-center mt-3">
              <Popover
                visible={showAddPopover}
                overlayClassName="add-popover"
                content={addSlideMenu}
                trigger="click"
                placement="bottomLeft"
              >
                <div
                  onClick={() => setShowAddPopover(true)}
                  className="w-8 h-8 rounded-full bg-[#495e54] flex items-center justify-center hover:opacity-60 cursor-pointer"
                >
                  <FileAddOutlined className="text-white" />
                </div>
              </Popover>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="bg-white shadow-lg w-full h-[450px] rounded-[8px] p-5 my-5">
            <div>
              <p>{activeSlide?.question}</p>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="bg-white h-full px-5 py-1">
            <MultipleChoice data={activeSlide} setData={handleEditQuestion} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EditPresentation;
