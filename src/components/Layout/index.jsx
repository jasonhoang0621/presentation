import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout as LayoutAntd, Menu, Spin } from "antd";
import "./layout.css";

import {
  CoffeeOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useIsFetching, useIsMutating, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGetListGroup } from "src/api/group";
import ChangePasswordModal from "../ChangePasswordModal";
import CreateGroupModal from "../CreateGroupModal";
import ProfileModal from "../ProfileModal";
const { Header, Sider, Content } = LayoutAntd;

const Layout = () => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState(0);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);

  const queryClient = useQueryClient();

  const { data: groupData } = useGetListGroup();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    queryClient.clear();
    navigate("/login");
  };

  useEffect(() => {
    const { pathname } = location;

    let key = "";
    if (groupData) {
      key = groupData.data.findIndex(
        (router) => router.id === pathname.split("/")[2]
      );
    }
    setActiveKey(key);
  }, [location, groupData]);

  return (
    <Spin spinning={isFetching + isMutating > 0}>
      <LayoutAntd>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo h-[64px] flex items-center justify-center">
            <p className="text-white font-semibold">MIDTERM</p>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            activeKey={[activeKey]}
            items={
              groupData &&
              groupData?.data.map((item) => ({
                label: item.name.toUpperCase(),
                icon: <CoffeeOutlined />,
                key: item.id,
                onClick: () => navigate(`/group/${item.id}`),
              }))
            }
          />
        </Sider>
        <LayoutAntd className="site-LayoutAntd">
          <Header className="site-layout-background flex items-center justify-between p-0">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
            <div className="flex items-center">
              <UsergroupAddOutlined
                className="text-white text-[22px] cursor-pointer hover:opacity-60 mr-5"
                onClick={() => setCreateGroupModal(true)}
              />
              <div className="mr-10 mb-2 relative">
                <div className="user-icon-header">
                  <UserOutlined className="text-white text-[20px] cursor-pointer hover:opacity-60" />
                  <ul className="hidden absolute right-0 top-[100%] bg-white z-10 min-w-[170px] shadow-2xl p-0 m-0 list-none user-icon-header-dropdown transition-all">
                    <li
                      className="text-[14px] leading-1 pl-5 cursor-pointer transition-all duration-200 hover:bg-[#44523f] hover:text-white"
                      onClick={() => setProfileModal(true)}
                    >
                      Profile
                    </li>
                    {!auth.user?.loginService && (
                      <li
                        className="text-[14px] pl-5 cursor-pointer transition-all duration-200 hover:bg-[#44523f] hover:text-white"
                        onClick={() => setChangePasswordModal(true)}
                      >
                        Change password
                      </li>
                    )}
                    <li
                      className="text-[14px] pl-5 cursor-pointer transition-all duration-200 hover:bg-[#44523f] hover:text-white"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Header>
          <Content className="site-layout-background mx-[16px] my-[24px] p-[24px] min-h-[280px]">
            <Outlet />
            <CreateGroupModal
              visible={createGroupModal}
              setVisible={setCreateGroupModal}
            />
            <ChangePasswordModal
              visible={changePasswordModal}
              setVisible={setChangePasswordModal}
            />
            <ProfileModal visible={profileModal} setVisible={setProfileModal} />
          </Content>
        </LayoutAntd>
      </LayoutAntd>
    </Spin>
  );
};

export default Layout;
