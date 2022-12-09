import { FileAddOutlined } from "@ant-design/icons";
import { Col, Popover, Row } from "antd";
import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDetailPresentation } from "src/api/presentation";
import { SlideType } from "src/helpers/slide";
import MainSlide from "./MainSlide";
import MultipleChoice from "./MultipleChoice";
import SmallSlide from "./SmallSlide";

const EditPresentation = () => {
  const { presentationId } = useParams();
  const [showAddPopover, setShowAddPopover] = React.useState(false);
  const [data, setData] = React.useState(null);
  const { data: rawData } = useDetailPresentation(presentationId);

  const [activeSlide, setActiveSlide] = React.useState(data ? data[0] : null);

  const handleAddNewSlide = (type) => {
    setShowAddPopover(false);
    switch (type) {
      case SlideType.MULTIPLE_CHOICE:
        setData({
          ...data,
          slide: [
            ...data.slide,
            {
              type: SlideType.MULTIPLE_CHOICE,
              question: "",
              answer: [],
              index: data.slide.length,
            },
          ],
        });
        break;
      case SlideType.HEADING:
        setData({
          ...data,
          slide: [
            ...data.slide,
            {
              type: SlideType.HEADING,
              question: "",
              answer: [],
              index: data.slide.length,
            },
          ],
        });
        break;
      case SlideType.PARAGRAPH:
        setData({
          ...data,
          slide: [
            ...data.slide,
            {
              type: SlideType.PARAGRAPH,
              question: "",
              answer: [],
              index: data.slide.length,
            },
          ],
        });
        break;
      default:
        break;
    }
  };

  const handleDeleteSlide = (deleteSlide) => {
    setData({
      ...data,
      slide: data?.slide.filter((item) => item.index !== deleteSlide),
    });
  };

  const handleEditQuestion = (value) => {
    const newSlide = data?.slide.map((item) => {
      if (item.index === activeSlide?.index) {
        return {
          ...item,
          ...value,
        };
      }
      return item;
    });
    setData({
      ...data,
      slide: newSlide,
    });
    setActiveSlide(newSlide[activeSlide.index]);
  };

  useEffect(() => {
    if (!rawData) return;
    setData(rawData?.data);
  }, [rawData]);

  useEffect(() => {
    if (!data) return;
    setActiveSlide(data?.slide[data?.slide.length - 1]);
  }, [data]);

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
            {data &&
              data?.slide.map((item, index) => (
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
            {activeSlide && <MainSlide data={activeSlide} />}
          </div>
        </Col>
        <Col span={8}>
          <div className="bg-white h-full px-5 py-1">
            {activeSlide && (
              <MultipleChoice data={activeSlide} setData={handleEditQuestion} />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EditPresentation;
