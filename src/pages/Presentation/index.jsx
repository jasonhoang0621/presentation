import { Modal } from "antd";
import React from "react";
import Slide from "src/components/Slide";

const Presentation = () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [deleteModal, setDeleteModal] = React.useState(false);

  return (
    <div>
      <div className="flex items-center justify-end mb-3    ">
        <button
          className="button button-danger !py-2 !min-w-[120px]"
          onClick={() => setDeleteModal(true)}
        >
          <span className="!text-[12px]">Delete</span>
        </button>
        <button className="button !py-2 !min-w-[120px]">
          <span className="!text-[12px]">Edit</span>
        </button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {data.map((item, index) => (
          <div key={index}>
            <Slide />
          </div>
        ))}
      </div>

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
