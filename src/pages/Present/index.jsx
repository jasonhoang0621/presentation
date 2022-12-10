import { WechatOutlined } from "@ant-design/icons";
import { Drawer, Input, Select, Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetListChat } from "src/api/chat";
import { useDetailPresentation } from "src/api/presentation";
import { SocketContext } from "src/socket/context";
import {
  changeSlide,
  createPresentation,
  editSendMessage,
} from "src/socket/emit";
import { listenChat, listenPresentation } from "src/socket/listen";
import { offChat, offPresentation } from "src/socket/off";

const Present = () => {
  const { socket } = useContext(SocketContext);
  const { presentationId } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const { data } = useDetailPresentation(presentationId);
  const auth = useSelector((state) => state.auth);
  const [chatLength, setChatLength] = useState(20);
  const [chatData, setChatData] = useState([]);
  const { data: chat, isFetching } = useGetListChat(presentationId, chatLength);
  const containerRef = useRef(null);

  const handleChangeSlide = (index) => {
    setCurrentSlide(index);
    changeSlide(socket, presentationId, index);
  };

  useEffect(() => {
    if (!chat) return;
    setChatData([...chat?.data, ...chatData]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  useEffect(() => {
    if (!socket) return;
    createPresentation(socket, presentationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    listenPresentation(socket, presentationId, (data) => {
      console.log(data);
    });
    listenChat(socket, presentationId, (data) => {
      toast(data?.data?.message);
      setChatData([...chatData, data?.data]);
      const chatBox = document.getElementById("chat-box");
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    });
    return () => {
      offChat(socket, presentationId);
      offPresentation(socket, presentationId);
    };
  }, [socket, presentationId, chatData]);

  const handleScroll = () => {
    if (containerRef.current.scrollTop === 0) {
      if (chatLength <= chatData.length) {
        setChatLength(chatLength + chatData.length);
      }
    }
  };

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
    }
    const chatBox = document.getElementById("chat-box");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: data?.name,
      },
    },
    tooltips: {
      display: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const chartData = {
    labels: data
      ? data.data.slide[currentSlide]?.answer.map((item) => item.value)
      : [],
    datasets: [
      {
        data: data
          ? data.data.slide[currentSlide]?.answer.map((item) => item.count)
          : [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
    scaleShowLabels: false,
  };

  return (
    <>
      <div style={{ height: "calc(100vh - 64px)" }} className="p-2">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-x-2 w-[15%]">
            <Select
              className="app-select"
              style={{ width: "100%" }}
              onChange={(value) => setCurrentSlide(value)}
              value={currentSlide}
            >
              {Array.isArray(data?.data?.slide) &&
                data?.data?.slide.map((item, index) => (
                  <Select.Option key={index} value={index}>
                    {index + 1}. {item?.question}
                  </Select.Option>
                ))}
            </Select>
          </div>
          <button
            onClick={() => handleChangeSlide(currentSlide + 1)}
            className="button !py-2 !min-w-[120px]"
          >
            <span className="!text-[14px]">Next</span>
          </button>
        </div>
        <div className="w-full flex items-center justify-center">
          <div
            className={`h-[600px] w-[90%] p-5 transition-all duration-300 flex flex-col items-center justify-between cursor-pointer overflow-hidden`}
          >
            <p className="break-all">
              {data?.data?.slide[currentSlide]?.question}
            </p>
            <Bar options={options} data={chartData} />
          </div>
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
              className="h-[90vh]  overflow-auto px-4 hide-scrollbar"
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

export default Present;
