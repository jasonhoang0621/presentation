import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetListPresentation } from "src/api/presentation";
import CreatePresentationModal from "src/components/CreatePresentaionModal";
import EditGroupModal from "src/components/EditGroupModal";
import Slide from "src/components/Slide";

const Group = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editGroupModal, setEditGroupModal] = React.useState(false);
  const [createPresentationModal, setCreatePresentationModal] =
    React.useState(false);
  const { data } = useGetListPresentation(id);
  console.log(data);

  return (
    <div>
      <div className="flex items-center justify-end mb-3">
        <button
          className="button button-danger !py-2 !min-w-[120px]"
          onClick={() => setEditGroupModal(true)}
        >
          <span className="!text-[12px]">Edit Group</span>
        </button>
        <button
          className="button !py-2 !min-w-[200px]"
          onClick={() => setCreatePresentationModal(true)}
        >
          <span className="!text-[12px]">Create Presentation</span>
        </button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {data &&
          data.data.map((item, index) => (
            <div key={index}>
              <Slide onClick={() => navigate(`presentation/${data?.id}`)} />
            </div>
          ))}
      </div>
      <EditGroupModal visible={editGroupModal} setVisible={setEditGroupModal} />
      <CreatePresentationModal
        visible={createPresentationModal}
        setVisible={setCreatePresentationModal}
      />
    </div>
  );
};

export default Group;
