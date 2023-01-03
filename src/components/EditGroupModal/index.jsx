import { CopyOutlined } from "@ant-design/icons";
import { Input, Modal, notification, Popover, Select, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAssignRole, useInviteUser, useRemoveUser } from "src/api/group";
import { useGetListUser } from "src/api/user";
import { SettingOutlined } from "@ant-design/icons";

const EditGroupModal = ({
  visible,
  setVisible,
  groupDetailData,
  loadingGroup,
  user,
}) => {
  const pararms = useParams();
  const auth = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const [removeUserModal, setRemoveUserModal] = React.useState(false);
  const [assignUserModal, setAssignUserModal] = React.useState(false);
  const [shareLinkModal, setShareLinkModal] = React.useState(false);
  const [inviteModal, setInviteModal] = React.useState(false);
  const [assignUser, setAssignUser] = React.useState(null);
  const [removeUser, setRemoveUser] = React.useState(null);
  const [leaveGroupModal, setLeaveGroupModal] = React.useState(false);
  const [deleteGroupModal, setDeleteGroup] = React.useState(false);
  const [showPopover, setShowPopover] = React.useState(false);
  const [shareLink, setShareLink] = React.useState("");
  const [listInviteByEmail, setListInviteByEmail] = React.useState([]);
  const [role, setRole] = useState("member");

  const { data: listUser = null } = useGetListUser();

  const { mutateAsync: inviteUser } = useInviteUser(pararms.id);

  const { mutateAsync: removeUserGroup } = useRemoveUser(pararms.id);
  const { mutateAsync: assignMember } = useAssignRole(pararms.id);

  const showRemoveButton = (record) => {
    if (user.role === "owner") {
      return (
        <button
          className="button button-danger !py-[5px] !min-w-[100px]"
          onClick={() => {
            setRemoveUser(record);
            setRemoveUserModal(true);
          }}
        >
          <span className="!text-[12px]">Remove</span>
        </button>
      );
    }
    if (user.role === "co-owner" && record.role !== "owner") {
      return (
        <button
          className="button button-danger !py-[5px] !min-w-[100px]"
          onClick={() => {
            setRemoveUser(record);
            setRemoveUserModal(true);
          }}
        >
          <span className="!text-[12px]">Remove</span>
        </button>
      );
    }

    return null;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text, record) => {
        switch (record.role) {
          case "owner":
            return (
              <div className="text-center">
                <Tag color="blue">Owner</Tag>
              </div>
            );
          case "co-owner":
            return (
              <div className="text-center">
                <Tag color="green">Co-owner</Tag>
              </div>
            );
          case "member":
            return (
              <div className="text-center">
                <Tag color="orange">Member</Tag>
              </div>
            );
          default:
            return (
              <div className="text-center">
                <Tag color="red">Unknown</Tag>
              </div>
            );
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        if (auth?.user?.id !== record.id) {
          return (
            <div className="flex items-center justify-center">
              {showRemoveButton(record)}
              {user.role === "owner" && (
                <button
                  className="button !py-[5px] !min-w-[100px]"
                  onClick={() => {
                    setAssignUser(record);
                    setAssignUserModal(true);
                    setRole(record.role);
                  }}
                >
                  <span className="!text-[12px]">Assign</span>
                </button>
              )}
            </div>
          );
        }
      },
    },
  ];

  const actionContent = (
    <div className="p-0">
      {user?.role !== "member" && (
        <>
          <div
            onClick={() => {
              setShareLinkModal(true);
              setShowPopover(false);
            }}
            className="px-7 py-3 bg-[#FFF] hover:bg-[#495e54] hover:text-white cursor-pointer transition-all duration-200"
          >
            <p className="text-[16px]">Create Link</p>
          </div>
          <div
            onClick={() => {
              setInviteModal(true);
              setShowPopover(false);
            }}
            className="px-7 py-3 bg-[#FFF] hover:bg-[#495e54] hover:text-white cursor-pointer transition-all duration-200"
          >
            <p className="text-[16px]">Invite</p>
          </div>
        </>
      )}
      {user?.role === "owner" && (
        <div
          onClick={() => {
            setDeleteGroup(true);
            setShowPopover(false);
          }}
          className="px-7 py-3 bg-[#FFF] hover:bg-[#495e54] hover:text-white cursor-pointer transition-all duration-200"
        >
          <p className="text-[16px]">Delete</p>
        </div>
      )}
      {user?.role !== "owner" && (
        <div
          onClick={() => {
            setLeaveGroupModal(true);
            setShowPopover(false);
          }}
          className="px-7 py-3 bg-[#FFF] hover:bg-[#495e54] hover:text-white cursor-pointer transition-all duration-200"
        >
          <p className="text-[16px]">Leave group</p>
        </div>
      )}
    </div>
  );

  const handleInviteUserByEmail = async () => {
    try {
      const result = await inviteUser({
        isEmail: true,
        memberEmail: listInviteByEmail,
      });
      if (result?.errorCode) {
        notification.error({
          message: result?.data,
        });
      } else {
        notification.success({
          message: "Invite user successfully",
        });
        setListInviteByEmail([]);
      }
      setInviteModal(false);
      queryClient.invalidateQueries(["group", pararms.id]);
    } catch (error) {
      notification.error({
        message: "Invite user failed",
      });
    }
  };

  const handleCopyToClipBoard = () => {
    navigator.clipboard.writeText(
      window.location.origin + "/invite/" + shareLink
    );
    notification.success({
      message: "Link Copied",
    });
  };

  const handleRemoveUser = async () => {
    const res = await removeUserGroup({ userId: removeUser.id });
    if (res.errorCode) {
      return notification.error({
        message: "Remove failed",
        description: res.data,
        duration: 1,
      });
    }
    notification.success({
      message: "Remove successfully",
      duration: 1,
    });
    queryClient.invalidateQueries("group");
    setRemoveUser(null);
    setRemoveUserModal(false);
  };

  const handleAssignRole = async () => {
    const res = await assignMember({ userId: assignUser.id, role: role });
    if (res.errorCode) {
      return notification.error({
        message: "Assign role failed",
        description: res.data,
        duration: 1,
      });
    }
    notification.success({
      message: "Assign role successfully",
      duration: 1,
    });
    queryClient.invalidateQueries("group");
    setAssignUser(null);
    setAssignUserModal(false);
  };

  const handleCloseInviteModal = () => {
    setInviteModal(false);
  };

  const handleLeaveGroup = async () => {};

  useEffect(() => {
    const getLinkInvite = async () => {
      const result = await inviteUser({
        isEmail: false,
      });
      if (result?.errorCode) {
        notification.error({
          message: result?.data,
        });
      } else {
        setShareLink(result?.data?.id);
      }
    };
    if (user?.role !== "member") {
      getLinkInvite();
    }
  }, [pararms, inviteUser, user]);
  return (
    <Modal
      title="Edit Group"
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      destroyOnClose
      width={"80%"}
    >
      <>
        <div className="flex items-center justify-end mb-5">
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
        <Table
          columns={columns}
          dataSource={groupDetailData?.data?.user}
          rowKey="id"
        />
        <Modal
          title={"Remove User"}
          visible={removeUserModal}
          onCancel={() => {
            setRemoveUserModal(false);
            setRemoveUser(null);
          }}
          footer={null}
          destroyOnClose
        >
          <div>
            <div className="">
              <p className="text-lg">
                Are you sure you want to remove{" "}
                <strong>{removeUser && removeUser.name}</strong> from this
                group?
              </p>
            </div>
            <div className="flex items-center justify-end mt-4">
              <button
                className="button button-danger mr-2 !py-[8px] !min-w-[120px]"
                onClick={() => {
                  setRemoveUserModal(false);
                  setAssignUser(null);
                  setRemoveUser(null);
                }}
              >
                <span className="!text-[12px]">Cancel</span>
              </button>
              <button
                className="button button-secondary !py-[8px] !min-w-[120px]"
                onClick={handleRemoveUser}
              >
                <span className="!text-[12px]">Remove</span>
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          title={"Remove User"}
          visible={leaveGroupModal}
          onCancel={() => setLeaveGroupModal(false)}
          footer={null}
          destroyOnClose
        >
          <div>
            <div className="">
              <p className="text-lg">
                Are you sure you want to leave this group?
              </p>
            </div>
            <div className="flex items-center justify-end mt-4">
              <button
                className="button button-danger mr-2 !py-[8px] !min-w-[120px]"
                onClick={() => {
                  setRemoveUserModal(false);
                  setAssignUser(null);
                  setRemoveUser(null);
                }}
              >
                <span className="!text-[12px]">Cancel</span>
              </button>
              <button
                className="button button-secondary !py-[8px] !min-w-[120px]"
                onClick={handleLeaveGroup}
              >
                <span className="!text-[12px]">Leave</span>
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          title={"Remove User"}
          visible={deleteGroupModal}
          onCancel={() => setDeleteGroup(false)}
          footer={null}
          destroyOnClose
        >
          <div>
            <div className="">
              <p className="text-lg">
                Are you sure you want to delete this group?
              </p>
            </div>
            <div className="flex items-center justify-end mt-4">
              <button
                className="button button-danger mr-2 !py-[8px] !min-w-[120px]"
                onClick={() => {
                  setRemoveUserModal(false);
                  setAssignUser(null);
                  setRemoveUser(null);
                }}
              >
                <span className="!text-[12px]">Cancel</span>
              </button>
              <button
                className="button button-secondary !py-[8px] !min-w-[120px]"
                onClick={handleLeaveGroup}
              >
                <span className="!text-[12px]">Delete</span>
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          title={"Assign User"}
          visible={assignUserModal}
          onCancel={() => {
            setAssignUserModal(false);
            setAssignUser(null);
            setRole(null);
          }}
          footer={null}
          destroyOnClose
        >
          <div>
            <p className="mb-2">
              Choose Role For <strong>{assignUser?.name}:</strong>
            </p>
            <Select
              mode="single"
              className="app-select"
              placeholder="Select Role"
              defaultValue={assignUser?.role}
              onChange={(value) => setRole(value)}
            >
              <Select.Option value="owner">Owner</Select.Option>
              <Select.Option value="co-owner">Co-owner</Select.Option>
              <Select.Option value="member">Member</Select.Option>
            </Select>
          </div>
          <div className="flex items-center justify-end mt-4">
            <button
              className="button button-danger !py-2 !min-w-[100px]"
              onClick={() => {
                setAssignUserModal(false);
                setAssignUser(null);
              }}
            >
              <span className="!text-[12px]">Cancel</span>
            </button>
            <button
              className="button button-secondary !py-2 !min-w-[100px]"
              onClick={handleAssignRole}
            >
              <span className="!text-[12px]">Assign</span>
            </button>
          </div>
        </Modal>
        <Modal
          title={"Share Link"}
          visible={shareLinkModal}
          onCancel={() => {
            setShareLinkModal(false);
          }}
          footer={null}
          destroyOnClose
        >
          <div>
            <Input
              className="app-input copy-input"
              readOnly
              value={window.location.origin + "/invite/" + shareLink}
              suffix={<CopyOutlined />}
              onClick={handleCopyToClipBoard}
            />
          </div>
        </Modal>
        <Modal
          title={"Invite User"}
          visible={inviteModal}
          onCancel={handleCloseInviteModal}
          footer={null}
          destroyOnClose
        >
          <div className="w-full">
            <p className="font-semibold">Enter Email:</p>
            <Select
              mode="tags"
              placeholder="Enter email"
              className="app-select"
              value={listInviteByEmail}
              onChange={(value) => setListInviteByEmail(value)}
            >
              {listUser &&
                groupDetailData &&
                listUser.data
                  .filter(
                    (item) =>
                      groupDetailData.data?.user.find(
                        (x) => x.id === item.id
                      ) === undefined
                  )
                  .map((item) => (
                    <Select.Option key={item.id} value={item.email}>
                      {item.email}
                    </Select.Option>
                  ))}
            </Select>
          </div>
          <div className="flex items-center justify-end mt-4">
            <button
              className="button button-danger !py-2 !min-w-[100px]"
              onClick={handleCloseInviteModal}
            >
              <span className="!text-[12px]">Cancel</span>
            </button>
            <button
              className="button button-secondary !py-2 !min-w-[100px]"
              onClick={handleInviteUserByEmail}
            >
              <span className="!text-[12px]">Invite</span>
            </button>
          </div>
        </Modal>
      </>
    </Modal>
  );
};

export default EditGroupModal;
