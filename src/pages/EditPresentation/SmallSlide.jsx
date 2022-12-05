import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";

const SmallSlide = ({ data }) => {
  const [confirmDeleteModal, setConfirmDeleteModal] = React.useState(false);

  return (
    <>
      <div className="flex mb-3 h-[150px] hover:opacity-90 transition-all duration-200 relative small-slide">
        <div className="text-white mr-2">1</div>
        <div className="bg-white w-full h-full rounded-[5px] p-1">cdc </div>
        <div
          onClick={() => setConfirmDeleteModal(true)}
          className="hidden absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#cdcdcd] transition-all duration-200 cursor-pointer items-center justify-center rounded-full small-slide-close"
        >
          <CloseOutlined className="text-[#495e54]" />
        </div>
      </div>
      <Modal
        visible={confirmDeleteModal}
        onCancel={() => setConfirmDeleteModal(false)}
        footer={null}
        centered
      ></Modal>
    </>
  );
};

export default SmallSlide;
