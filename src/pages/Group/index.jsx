import React from "react";
import { useNavigate } from "react-router-dom";
import EditGroupModal from "src/components/EditGroupModal";
import Slide from "src/components/Slide";

const Group = () => {
  const navigate = useNavigate();
  const data = [1, 2];
  const [editGroupModal, setEditGroupModal] = React.useState(false);

  return (
    <div>
      <div className="flex items-center justify-end mb-3">
        <button
          className="button !py-2 !min-w-[120px]"
          onClick={() => setEditGroupModal(true)}
        >
          <span className="!text-[12px]">Edit Group</span>
        </button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {data.map((item, index) => (
          <div key={index}>
            <Slide onClick={() => navigate(`presentation/${data?.id}`)} />
          </div>
        ))}
      </div>
      <EditGroupModal visible={editGroupModal} setVisible={setEditGroupModal} />
    </div>
  );
};

export default Group;
