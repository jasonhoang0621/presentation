import { CopyOutlined } from "@ant-design/icons";
import { Input, Modal, notification, Select, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  useAssignRole,
  useDetailGroup,
  useInviteUser,
  useRemoveUser,
} from "src/api/group";
import { useGetListUser } from "src/api/user";

const Group = () => {
  const pararms = useParams();
  const auth = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [user, setUser] = useState({
    role: "member",
  });
  const [removeUserModal, setRemoveUserModal] = React.useState(false);
  const [assignUserModal, setAssignUserModal] = React.useState(false);
  const [shareLinkModal, setShareLinkModal] = React.useState(false);
  const [inviteModal, setInviteModal] = React.useState(false);
  const [assignUser, setAssignUser] = React.useState(null);
  const [removeUser, setRemoveUser] = React.useState(null);
  const [shareLink, setShareLink] = React.useState("");
  const [listInviteByEmail, setListInviteByEmail] = React.useState([]);
  const [role, setRole] = useState("member");

  const { data: groupDetailData = null, isLoading: loadingGroup } =
    useDetailGroup(pararms.id);
  const { data: listUser = null } = useGetListUser();

  const { mutateAsync: inviteUser } = useInviteUser(pararms.id);

  const { mutateAsync: removeUserGroup } = useRemoveUser(pararms.id);
  const { mutateAsync: assignMember } = useAssignRole(pararms.id);

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
      description: "Remove successfully",
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
      description: "Assign role successfully",
      duration: 1,
    });
    queryClient.invalidateQueries("group");
    setAssignUser(null);
    setAssignUserModal(false);
  };

  const handleCloseInviteModal = () => {
    setInviteModal(false);
  };

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
    <>
      <div className="flex items-center justify-end mb-5">
        {user.role !== "member" && (
          <>
            <button
              className="button button-danger !py-[8px] !min-w-[120px]"
              onClick={() => setShareLinkModal(true)}
            >
              <span className="!text-[13px]">Create Link</span>
            </button>
            <button
              className="button !py-[8px] !min-w-[120px]"
              onClick={() => setInviteModal(true)}
            >
              <span className="!text-[13px]">Invite</span>
            </button>
          </>
        )}
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
              <strong>{removeUser && removeUser.name}</strong> from this group?
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
                    groupDetailData.data?.user.find((x) => x.id === item.id) ===
                    undefined
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
  );
};

export default Group;
