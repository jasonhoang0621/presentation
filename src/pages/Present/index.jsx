import { WechatOutlined } from "@ant-design/icons";
import { Drawer, Input, notification, Select, Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetListChat } from "src/api/chat";
import {
  useDetailPresentation,
  useExitPresentation,
} from "src/api/presentation";
import { Reaction, SlideType } from "src/helpers/slide";
import { SocketContext } from "src/socket/context";
import { changeSlide, editSendMessage } from "src/socket/emit";
import { listenChat, listenPresentation } from "src/socket/listen";
import { offChat, offPresentation } from "src/socket/off";

const Present = () => {
  const { socket } = useContext(SocketContext);
  const { groupId, presentationId } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const { data } = useDetailPresentation(presentationId);
  const auth = useSelector((state) => state.auth);
  const [chatLength, setChatLength] = useState(0);
  const [chatData, setChatData] = useState([]);
  const { mutateAsync } = useExitPresentation();
  const queryClient = useQueryClient();
  const { data: chat, isFetching } = useGetListChat(
    presentationId,
    chatLength,
    chatLength > 20 ? 5 : 20
  );
  const containerRef = useRef(null);

  const handleChangeSlide = (index) => {
    if (!socket) return;
    if (index === data?.data?.slide.length) {
      notification.error({
        message: "Error",
        description: "You are at the last slide",
      });
      return;
    }
    setCurrentSlide(index);
    changeSlide(socket, presentationId, index);
  };

  const handleEndShow = async () => {
    await mutateAsync({ presentationId: presentationId });
    queryClient.invalidateQueries(["group", groupId]);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/group/${groupId}/presentation/${presentationId}/join/public`
    );
    notification.success({
      message: "Link copied to clipboard",
    });
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

  useEffect(() => {
    setTimeout(() => {
      const chatBox = document.getElementById("chat-box");
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 2000);
  }, []);

  const handleScroll = () => {
    if (containerRef.current.scrollTop === 0) {
      if (chatLength <= chatData.length) {
        setChatLength(chatData.length);
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
      const chatBox = document.getElementById("chat-box");
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }
  };

  useEffect(() => {
    return () => handleEndShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderQuestionType = () => {
    const type = data?.data?.slide[currentSlide]?.type;
    switch (type) {
      case SlideType.MULTIPLE_CHOICE: {
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
                ? data.data.slide[currentSlide]?.answer.map(
                    (item) => item.amount
                  )
                : [],
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
          scaleShowLabels: false,
        };
        return (
          <>
            <p className="break-all text-xl">
              {data?.data?.slide[currentSlide]?.question}
            </p>
            <Bar options={options} data={chartData} />
          </>
        );
      }
      case SlideType.HEADING:
        return (
          <>
            <p className="break-all text-[40px]">
              {data?.data?.slide[currentSlide]?.question}
            </p>
            <p className="break-all mt-2 text-[20px]">
              {data?.data?.slide[currentSlide]?.paragraph}
            </p>
            <div className="flex items-center justify-center mt-5">
              {data?.data?.slide[currentSlide]?.icon.map(({ type }) => {
                const Icon = Reaction.find((item) => item.type === type)?.Icon;
                return (
                  <div
                    key={type}
                    className={
                      "flex items-center justify-center w-12 h-12 bg-[#495e54] drop-shadow-md rounded-full mr-3 transition-all duration-200 relative"
                    }
                  >
                    <Icon className="text-white text-[20px]" />
                    {data?.data?.slide[currentSlide]?.icon?.find(
                      (item) => item?.type === type
                    )?.amount > 0 && (
                      <div className="absolute -top-1 -right-1 rounded-full min-w-4 px-1 h-4 flex items-center justify-center bg-white text-[#495e54] drop-shadow-md text-[10px]">
                        {
                          data?.data?.slide[currentSlide]?.icon?.find(
                            (item) => item?.type === type
                          )?.amount
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        );
      case SlideType.PARAGRAPH:
        return (
          <>
            <p className="break-all text-[40px]">
              {data?.data?.slide[currentSlide]?.question}
            </p>
            <p className="break-all mt-2 text-[30px]">
              {data?.data?.slide[currentSlide]?.paragraph}
            </p>
            <div className="flex items-center justify-center mt-5">
              {data?.data?.slide[currentSlide]?.icon.map(({ type }) => {
                const Icon = Reaction.find((item) => item.type === type)?.Icon;
                return (
                  <div
                    key={type}
                    className={
                      "flex items-center justify-center w-12 h-12 bg-[#495e54] drop-shadow-md rounded-full mr-3 transition-all duration-200 relative"
                    }
                  >
                    <Icon className="text-white text-[20px]" />
                    {data?.data?.slide[currentSlide]?.icon?.find(
                      (item) => item?.type === type
                    )?.amount > 0 && (
                      <div className="absolute -top-1 -right-1 rounded-full min-w-4 px-1 h-4 flex items-center justify-center bg-white text-[#495e54] drop-shadow-md text-[10px]">
                        {
                          data?.data?.slide[currentSlide]?.icon?.find(
                            (item) => item?.type === type
                          )?.amount
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <div style={{ height: "calc(100vh - 64px)" }} className="p-2">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-x-2 w-[15%]">
            <Select
              className="app-select"
              style={{ width: "100%" }}
              onChange={(value) => handleChangeSlide(value)}
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
          <div className="flex items-center">
            {window.location.pathname.includes("public") && (
              <button
                onClick={handleShare}
                className="button button-danger !py-2 !min-w-[120px]"
              >
                <span className="!text-[14px]">Share</span>
              </button>
            )}
            <button
              onClick={() => handleChangeSlide(currentSlide + 1)}
              className="button !py-2 !min-w-[120px]"
            >
              <span className="!text-[14px]">Next</span>
            </button>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <div
            className={`h-[600px] w-[90%] p-5 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden`}
          >
            {renderQuestionType()}
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
