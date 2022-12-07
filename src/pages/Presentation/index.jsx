import { Modal } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import Slide from "src/components/Slide";

const Presentation = () => {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [detailModal, setDetailModal] = React.useState(false);
  const data = {
    id: 1,
    name: "hello",
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="button button-danger !py-2 !min-w-[120px]"
            onClick={() => setDeleteModal(true)}
          >
            <span className="!text-[12px]">Delete</span>
          </button>
          <button
            className="button !py-2 !min-w-[120px]"
            onClick={() => navigate("edit")}
          >
            <span className="!text-[12px]">Edit</span>
          </button>
        </div>
        <div className="flex items-center">
          <button
            className="button button-danger !py-2 !min-w-[120px]"
            onClick={() => navigate("present/private")}
          >
            <span className="!text-[12px]">Private</span>
          </button>
          <button
            className="button !py-2 !min-w-[120px]"
            onClick={() => navigate("present/public")}
          >
            <span className="!text-[12px]">Public</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-3">
        {[1, 2, 3].map((item, index) => (
          <div key={index}>
            <Slide data={data} onClick={() => setDetailModal(true)} />
          </div>
        ))}
      </div>
      <Modal
        visible={detailModal}
        onCancel={() => setDetailModal(false)}
        footer={null}
        destroyOnClose
        width={"70%"}
      >
        <Slide noBorder isLabel />
      </Modal>
      <Modal
        title="Confirm Delete"
        visible={deleteModal}
        onCancel={() => setDeleteModal(false)}
        footer={null}
      >
        <p className="text-[18px] mt-0">
          Are you sure you want to delete this Presentation?
        </p>
        <div className="flex justify-end mt-7">
          <button
            className="button button-danger !py-2 !min-w-[120px]"
            onClick={() => setDeleteModal(false)}
          >
            <span className="!text-[12px]">Cancel</span>
          </button>
          <button
            className="button !py-2 !min-w-[120px]"
            onClick={() => setDeleteModal(false)}
          >
            <span className="!text-[12px]">Delete</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Presentation;
