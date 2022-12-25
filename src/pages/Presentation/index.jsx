import { Modal, notification, Popover } from "antd";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDetailGroup } from "src/api/group";
import {
  useDetailPresentation,
  usePresentPresentation,
  useRemovePresentation,
} from "src/api/presentation";
import Slide from "src/components/Slide";
import { SettingOutlined } from "@ant-design/icons";
import { SlideType } from "src/helpers/slide";

const Presentation = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { groupId, presentationId } = useParams();
  const [showPopover, setShowPopover] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [detailModal, setDetailModal] = React.useState(false);
  const [detailData, setDetailData] = React.useState({});
  const [disablePresent, setDisablePresent] = React.useState(false);
  const { mutateAsync } = usePresentPresentation();
  const [user, setUser] = useState({
    role: "member",
  });

  const queryClient = useQueryClient();

  const { data } = useDetailPresentation(presentationId);
  const { data: groupDetailData = null } = useDetailGroup(groupId);

  useEffect(() => {
    if (groupDetailData) {
      const temp = groupDetailData.data.user.filter(
        (item) => item.id === auth?.user?.id
      );
      setUser({
        role: temp[0]?.role ?? "member",
      });
      if (groupDetailData.data?.presenting) {
        setDisablePresent(true);
        return;
      }
      setDisablePresent(false);
    }
  }, [auth, groupDetailData]);
  const { mutateAsync: deletePresentation } =
    useRemovePresentation(presentationId);

  const handleDeletePresentation = async () => {
    const res = await deletePresentation({
      groupId: groupId,
    });
    if (res?.errorCode) {
      notification.error({
        message: res?.data,
      });
      return;
    }
    notification.success({
      message: "Delete presentation successfully",
    });
    queryClient.invalidateQueries("presentation");
    setDeleteModal(false);
    navigate(`/group/${groupId}`);
  };
  const handlePublicPresent = async () => {
    if (data?.data?.slide.length === 0) {
      notification.error({
        message: "Please add slide to present",
      });
      return;
    }
    const res = await mutateAsync({ presentationId: data?.data?.id });
    if (res?.errorCode) {
      notification.error({
        message: res?.data,
      });
      setDisablePresent(true);
      return;
    } else {
      navigate("present/public");
    }
  };

  const actionContent = (
    <div className="p-0">
      {user?.role !== "member" ? (
        <>
          <div
            onClick={() => handlePublicPresent()}
            className={`px-7 py-3 bg-[#FFF] hover:bg-[#495e54] hover:text-white cursor-pointer transition-all duration-200 ${
              disablePresent ? "pointer-events-none text-gray-200" : ""
            }`}
          >
            <p className="text-[16px]">Public Present</p>
          </div>
          <div
            onClick={() => navigate("present/private")}
            className={`px-7 py-3 bg-[#FFF] hover:bg-[#495e54] hover:text-white cursor-pointer transition-all duration-200 ${
              disablePresent ? "pointer-events-none text-gray-200" : ""
            }`}
          >
            <p className="text-[16px]">Private Present</p>
          </div>
          <div
            onClick={() => navigate("edit")}
            className="px-7 py-3 bg-[#FFF] hover:bg-[#495e54] hover:text-white cursor-pointer transition-all duration-200"
          >
            <p className="text-[16px]">Edit</p>
          </div>
          <div
            onClick={() => {
              setDeleteModal(true);
              setShowPopover(false);
            }}
            className="px-7 py-3 bg-[#FFF] hover:bg-[#495e54] hover:text-white cursor-pointer transition-all duration-200"
          >
            <p className="text-[16px]">Delete</p>
          </div>
        </>
      ) : (
        <>
          <div
            onClick={() => navigate("join")}
            className="px-7 py-3 bg-[#FFF] hover:bg-[#495e54] hover:text-white cursor-pointer transition-all duration-200"
          >
            <p className="text-[16px]">Join Presentation</p>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold mb-5">{data?.data?.name}</p>
        <Popover
          content={actionContent}
          placement="bottomRight"
          trigger="click"
          overlayClassName="add-popover"
          visible={showPopover}
          onVisibleChange={(visible) => setShowPopover(visible)}
        >
          <div
            className="w-8 h-8 drop-shadow-lg bg-white rounded-full flex items-center justify-center cursor-pointer
          "
          >
            <SettingOutlined />
          </div>
        </Popover>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-3">
        {data &&
          data?.data?.slide.map((item, index) => (
            <div key={index}>
              <Slide
                data={item}
                onClick={() => {
                  setDetailData(item);
                  setDetailModal(true);
                }}
              />
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
        <div
          className={
            detailData.type === SlideType.HEADING ||
            detailData.type === SlideType.PARAGRAPH
              ? "min-h-[55vh] flex items-center justify-center"
              : ""
          }
        >
          <Slide noBorder isLabel data={detailData} />
        </div>
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
            onClick={handleDeletePresentation}
          >
            <span className="!text-[12px]">Delete</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Presentation;
