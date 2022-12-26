import { WechatOutlined } from "@ant-design/icons";
import { Drawer, Input, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetListChat } from "src/api/chat";
import { SlideType } from "src/helpers/slide";
import { SocketContext } from "src/socket/context";
import { listenChat, listenPresentation } from "src/socket/listen";
import { offChat, offPresentation } from "src/socket/off";

const PublicJoin = () => {
  const navigate = useNavigate();
  const { groupId, presentationId } = useParams();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [chatLength, setChatLength] = useState(0);
  const containerRef = React.useRef(null);
  const [userName, setUserName] = useState(localStorage.getItem("name"));
  // const [index, setIndex] = useState(0);
  const data = {
    id: 1,
    type: SlideType.MULTIPLE_CHOICE,
    question: "What is your favorite color?",
    answer: ["Red", "Blue", "Yellow", "Red", "Blue", "Green", "Yellow"],
  };

  const [chatData, setChatData] = useState([]);
  const { data: chat, isFetching } = useGetListChat(
    presentationId,
    chatLength,
    chatLength > 20 ? 5 : 20
  );

  const [activeAnswer, setActiveAnswer] = React.useState(null);
  const { socket } = useContext(SocketContext);

  const handleScroll = () => {
    if (containerRef.current.scrollTop === 0) {
      if (chatLength <= chatData.length) {
        setChatLength(chatData.length);
      }
    }
  };

  useEffect(() => {
    if (!chat) return;
    setChatData([...chat?.data, ...chatData]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  const handleClickToast = () => {
    setOpenDrawer(true);
    setTimeout(() => {
      const chatBox = document.getElementById("chat-box");
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 500);
  };

  useEffect(() => {
    if (!socket) return;
    listenPresentation(socket, presentationId, (data) => {
      console.log(data);
    });

    listenChat(socket, presentationId, (data) => {
      toast(data?.data?.user[0]?.name + ": " + data?.data?.message, {
        onClick: handleClickToast,
      });
      setChatData([...chatData, data?.data]);
      setTimeout(() => {
        const chatBox = document.getElementById("chat-box");
        if (chatBox) {
          chatBox.scrollTop = chatBox.scrollHeight;
        }
      }, 500);
    });
    return () => {
      offChat(socket, presentationId);
      offPresentation(socket, presentationId);
    };
  }, [socket, presentationId, chatData]);

  useEffect(() => {
    setTimeout(() => {
      const chatBox = document.getElementById("chat-box");
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 2000);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      navigate(`/group/${groupId}/presentation/${presentationId}/join`, {
        replace: true,
      });
    }
  }, [groupId, presentationId, navigate]);

  if (!userName) {
    return (
      <div>
        <p>Enter your name:</p>
        <Input
          className="app-input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="pt-[10vh] px-[15vw] bg-[#f0f2f5] h-screen">
        <p className="text-center text-2xl mt-5">{data?.question}</p>
        <div className="mt-10 flex flex-wrap">
          {data?.answer.map((answer, index) => (
            <div
              key={index}
              className={`app-input text-center w-[32%] mx-auto cursor-pointer ${
                activeAnswer === index ? "bg-[#495e54] text-white" : "bg-white"
              }`}
              onClick={() => setActiveAnswer(index)}
            >
              {answer}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button className="button !py-2">
            <span className="!text-[14px]">Submit</span>
          </button>
        </div>
      </div>
      <div
        onClick={() => setOpenDrawer(true)}
        className="fixed bottom-10 right-5 w-12 h-12 bg-[#495e54] rounded-full cursor-pointer hover:opacity-80"
      >
        <div className="flex items-center justify-center w-full h-full">
          <WechatOutlined className="text-white text-[24px]" />
        </div>
      </div>
      <Drawer
        placement="right"
        width={400}
        onClose={() => setOpenDrawer(false)}
        visible={openDrawer}
        closable={false}
        bodyStyle={{ padding: 0, overflow: "hidden" }}
      >
        <Spin spinning={isFetching}>
          <div className="my-5 h-rc-rate-star-full">
            <div
              id="chat-box"
              className="h-[90vh]  overflow-auto px-4 "
              ref={containerRef}
              onScroll={handleScroll}
            >
              {chatData &&
                chatData.map((chat, index) => (
                  <div key={index}>
                    <div className="mb-5 bg-[#495e54] p-2 rounded-lg inline-block">
                      <strong className="text-white">
                        {chat?.user[0]?.name}
                      </strong>
                      <p className="text-white break-all">{chat.message}</p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-auto px-4">
              <p className="text-center text-[16px]">
                <Link
                  className="text-[#495E54] cursor-pointer hover:text-white mb-3 mt-1"
                  to="/login"
                >
                  Login{" "}
                </Link>
                and join group to chat!
              </p>
            </div>
          </div>
        </Spin>
      </Drawer>
    </>
  );
};

export default PublicJoin;
