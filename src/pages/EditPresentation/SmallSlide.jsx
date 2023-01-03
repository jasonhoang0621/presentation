import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

const SmallSlide = ({ index, data, handleDeleteSlide, activeSlide, setActiveSlide }) => {
  const [confirmDeleteModal, setConfirmDeleteModal] = React.useState(false);
  const [deleteSlide, setDeleteSlide] = React.useState(null);

  return (
    <>
      <div
        onClick={() => setActiveSlide(data)}
        className={`flex p-2 h-[120px] hover:opacity-90 transition-all duration-200 relative small-slide ${
          activeSlide?.index === data?.index ? 'bg-[#495e544b]' : ''
        }`}
      >
        <div className='mr-2'>{index}</div>
        <div className='bg-white w-full h-full rounded-[5px] p-1 text-center border border-[#495e54] font-semibold break-all overflow-hidden'>
          {data?.question}
        </div>
        <div
          onClick={() => {
            setDeleteSlide(data?.index);
            setConfirmDeleteModal(true);
          }}
          className='hidden absolute -top-0 -right-0 w-5 h-5 bg-[#495e54] transition-all duration-200 cursor-pointer items-center justify-center rounded-full small-slide-close'
        >
          <CloseOutlined className='text-white text-[10px]' />
        </div>
      </div>
      <Modal
        visible={confirmDeleteModal}
        onCancel={() => setConfirmDeleteModal(false)}
        title='Confirm delete'
        footer={null}
        centered
      >
        <div className='text-center'>
          <p className='text-[#495e54] text-xl font-semibold'>
            Are you sure you want to delete this Slide?
          </p>
          <div className='flex items-center justify-end mt-4'>
            <button
              className='button button-danger mr-2 !py-[8px] !min-w-[120px]'
              onClick={() => setConfirmDeleteModal(false)}
            >
              <span className='!text-[12px]'>Cancel</span>
            </button>
            <button
              className='button button-secondary !py-[8px] !min-w-[120px]'
              onClick={() => {
                handleDeleteSlide(deleteSlide);
                setConfirmDeleteModal(false);
              }}
            >
              <span className='!text-[12px]'>Remove</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default React.memo(SmallSlide);
