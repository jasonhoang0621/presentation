import { WechatOutlined } from "@ant-design/icons";
import { Drawer, Input, notification, Spin } from "antd";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetListChat } from "src/api/chat";
import { useDetailPresentation } from "src/api/presentation";
import { SlideType } from "src/helpers/slide";
import { SocketContext } from "src/socket/context";
import { editSendMessage } from "src/socket/emit";
import { listenChat, listenPresentation } from "src/socket/listen";
import { offChat, offPresentation } from "src/socket/off";
import Heading from "../../components/Join/Heading";
import MultipleChoice from "../../components/Join/MultiplceChoice";

const Join = () => {
  const auth = useSelector((state) => state.auth);
  const { presentationId } = useParams();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [chatMessage, setChatMessage] = React.useState("");
  const [chatLength, setChatLength] = useState(0);
  const containerRef = React.useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [noPresent, setNoPresent] = useState(false);
  const [data, setData] = useState(null);

  const { data: presentationData } = useDetailPresentation(presentationId);

  const [chatData, setChatData] = useState([]);
  const { data: chat, isFetching } = useGetListChat(
    presentationId,
    chatLength,
    chatLength > 20 ? 5 : 20
  );

  const { socket } = useContext(SocketContext);

  const handleSentMessage = (e) => {
    if (e.key === "Enter") {
      setChatData([
        ...chatData,
        {
          userId: auth?.user?.id,
          message: chatMessage,
          user: [
            {
              name: auth?.user?.name,
            },
          ],
        },
      ]);
      editSendMessage(socket, presentationId, chatMessage);
      setChatMessage("");
      setTimeout(() => {
        const chatBox = document.getElementById("chat-box");
        if (chatBox) {
          chatBox.scrollTop = chatBox.scrollHeight;
        }
      }, 500);
    }
  };

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
      setSlideIndex(data?.data?.index);
    });

    listenChat(socket, presentationId, (data) => {
      toast(data?.data?.user[0].name + ": " + data?.data?.message, {
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
    if (data) {
      if (data?.data?.slideIndex === null) {
        notification.error({
          description: "Presentation not found",
        });
        setNoPresent(true);
        return;
      }
      setSlideIndex(data?.data?.slideIndex);
    }
  }, [data]);

  useEffect(() => {
    if (presentationData) {
      setData(presentationData);
    }
  }, [presentationData]);

  const renderSlide = useMemo(() => {
    if (!data) return;
    switch (data?.data?.slide[slideIndex]?.type) {
      case SlideType.MULTIPLE_CHOICE:
        return <MultipleChoice data={data?.data?.slide[slideIndex]} />;
      case SlideType.HEADING:
      case SlideType.PARAGRAPH:
        return <Heading data={data?.data?.slide[slideIndex]} />;
      default:
        return <div className="text-center mt-5 text-2xl">Slide not found</div>;
    }
  }, [slideIndex, data]);

  return (
    <>
      {noPresent ? (
        <div className="h-screen flex items-center justify-center">
          <p className="text-[40px]">Waiting for the host to present</p>
        </div>
      ) : (
        <>
          <div className="px-[15vw]" style={{ height: "calc(100vh - 64px)" }}>
            {renderSlide}
          </div>
          <div
            onClick={() => setOpenDrawer(true)}
            className="fixed bottom-10 right-5 w-12 h-12 bg-[#495e54] rounded-full cursor-pointer hover:opacity-80"
          >
            <div className="flex items-center justify-center w-full h-full">
              <WechatOutlined className="text-white text-[24px]" />
            </div>
          </div>
        </>
      )}
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
              className="h-[90vh]  overflow-auto px-4"
              ref={containerRef}
              onScroll={handleScroll}
            >
              {chatData &&
                chatData.map((chat, index) => (
                  <div key={index}>
                    {chat.userId === auth?.user?.id ? (
                      <div className="flex justify-end">
                        <div className="mb-5 text-end p-2 border border-[#495e54] rounded-lg inline-block">
                          <strong>{chat.user[0].name}</strong>
                          <p className="text-left">{chat.message}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-5 bg-[#495e54] p-2 rounded-lg inline-block">
                        <strong className="text-white">
                          {chat.user[0].name}
                        </strong>
                        <p className="text-white break-all">{chat.message}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <div className="mt-auto px-4">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => handleSentMessage(e)}
                className="app-input !m-0"
                placeholder="Chat..."
              />
            </div>
          </div>
        </Spin>
      </Drawer>
    </>
  );
};

export default Join;
