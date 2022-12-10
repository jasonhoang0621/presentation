import { Modal } from "antd";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "src/socket/context";
import { changeSlide, createPresentation } from "src/socket/emit";

const PresentModal = ({ visible, setVisible }) => {
  const { presentationId } = useParams();
  const { socket } = useContext(SocketContext);

  const handleTest = (index) => {
    changeSlide(socket, presentationId, index);
  };

  useEffect(() => {
    if (!socket) return;
    // createPresentation(socket, presentationId);
  }, [socket, presentationId]);

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={"90%"}
      destroyOnClose
    >
      <button
        className="button"
        onClick={() => handleTest(Math.floor(Math.random() * 10))}
      >
        Test
      </button>
    </Modal>
  );
};

export default PresentModal;
