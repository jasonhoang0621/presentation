import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDetailGroup } from "src/api/group";
import { useGetListPresentation } from "src/api/presentation";
import CreatePresentationModal from "src/components/CreatePresentaionModal";
import EditGroupModal from "src/components/EditGroupModal";
import Slide from "src/components/Slide";

const Group = () => {
  const auth = useSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();
  const [editGroupModal, setEditGroupModal] = React.useState(false);
  const [createPresentationModal, setCreatePresentationModal] =
    React.useState(false);
  const [user, setUser] = useState({
    role: "member",
  });

  const { data } = useGetListPresentation(id);
  const { data: groupDetailData = null, isLoading: loadingGroup } =
    useDetailGroup(id);

  useEffect(() => {
    if (groupDetailData) {
      const temp = groupDetailData.data.user.filter(
        (item) => item.id === auth?.user?.id
      );
      setUser({
        role: temp[0]?.role ?? "member",
      });
    }
  }, [loadingGroup, auth, groupDetailData]);
  console.log(data)
  return (
    <div>
      <div className="flex items-center justify-end mb-3">
        <>
          <button
            className="button button-danger !py-2 !min-w-[120px]"
            onClick={() => setEditGroupModal(true)}
          >
            <span className="!text-[12px]">
              {user?.role === "owner" ? "Edit Group" : "View Group"}
            </span>
          </button>
          {user?.role === "owner" && (
            <button
              className="button !py-2 !min-w-[200px]"
              onClick={() => setCreatePresentationModal(true)}
            >
              <span className="!text-[12px]">Create Presentation</span>
            </button>
          )}
        </>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {data &&
          data.data.map((item, index) => (
            <div key={index}>
              <div>
                <Slide
                  data={item?.slide.length > 0 ? item?.slide[0] : null}
                  onClick={() => navigate(`presentation/${item?.id}`)}
                />
              </div>
              <p className="text-center mb-5 mt-2 font-semibold">
                {item?.name}
              </p>
            </div>
          ))}
      </div>
      <EditGroupModal
        visible={editGroupModal}
        setVisible={setEditGroupModal}
        groupDetailData={groupDetailData}
        loadingGroup={loadingGroup}
        user={user}
      />
      <CreatePresentationModal
        visible={createPresentationModal}
        setVisible={setCreatePresentationModal}
      />
    </div>
  );
};

export default Group;
