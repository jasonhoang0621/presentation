import {
  HistoryOutlined,
  QuestionCircleOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import { Drawer, notification, Select, Spin } from "antd";
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
import Chat from "src/components/Present/Chat";
import History from "src/components/Present/History";
import Question from "src/components/Present/Question";
import { Reaction, SlideType } from "src/helpers/slide";
import { SocketContext } from "src/socket/context";
import { changeSlide, editSendMessage } from "src/socket/emit";
import {
  listenAnswer,
  listenChat,
  listenPresentation,
} from "src/socket/listen";
import { offAnswer, offChat, offPresentation } from "src/socket/off";

const Present = () => {
  const { socket } = useContext(SocketContext);
  const { groupId, presentationId } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openChatDrawer, setOpenChatDrawer] = useState(false);
  const [openQuestionDrawer, setOpenQuestionDrawer] = useState(false);
  const [historyDrawer, setHistoryDrawer] = useState(false);
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
  const [presentation, setPresentation] = useState(data);
  const [questionData, setQuestionData] = useState([
    {
      id: 1,
      name: "John Doe",
      question: "How to use React?",
      upVote: ["123", "adcjnadjhcn ajd"],
      answer: [
        {
          id: 1,
          name: "John Doe 1",
          content: "You can use React by using create-react-app",
        },
      ],
    },
    {
      id: 2,
      name: "John Doe",
      question: "How to use React?",
      upVote: ["123", "adcjnadjhcn ajd"],
      answer: [
        {
          id: 1,
          name: "John Doe 1",
          content: "You can use React by using create-react-app",
        },
      ],
    },
    {
      id: 3,
      name: "John Doe",
      question:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates dolor ea perferendis mollitia. Deserunt odit accusantium id tempore similique iste, tempora veniam quaerat laborum numquam facere sunt deleniti. Tempora, dignissimos!Possimus, ut saepe eius nemo voluptas praesentium ad nisi. Esse qui itaque iusto harum, dolores autem similique voluptas, numquam est aliquid soluta suscipit ipsa minima nam adipisci neque. Error, aspernatur?",
      upVote: ["123", "adcjnadjhcn ajd"],
      answer: [
        {
          id: 1,
          name: "John Doe 1",
          content: "You can use React by using create-react-app",
        },
        {
          id: 2,
          name: "John Doe 1",
          content: "You can use React by using create-react-app",
        },
        {
          id: 3,
          name: "John Doe 1",
          content: "You can use React by using create-react-app",
        },
      ],
    },
  ]);

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
    setOpenChatDrawer(true);
    setTimeout(() => {
      const chatBox = document.getElementById("chat-box");
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 500);
  };

  useEffect(() => {
    if (!data) return;
    setPresentation(data);
  }, [data]);

  useEffect(() => {
    if (!socket) return;
    listenPresentation(socket, presentationId, (data) => {
      console.log(data);
    });
    listenAnswer(socket, presentationId, data?.slideIndex ?? 0, (response) => {
      console.log(response);
      setPresentation(response);
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
      offAnswer(socket, presentationId, data?.slideIndex ?? 0);
    };
  }, [socket, presentationId, chatData]);

  const handleScroll = () => {
    if (containerRef.current.scrollTop === 0) {
      if (chatLength <= chatData.length) {
        setChatLength(chatData.length);
      }
    }
  };

  const handleSentMessage = (chatMessage) => {
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
    setTimeout(() => {
      const chatBox = document.getElementById("chat-box");
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 500);
  };

  const handleOpenChatDrawer = () => {
    setTimeout(() => {
      const chatBox = document.getElementById("chat-box");
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 500);
    setOpenChatDrawer(true);
  };

  const handleUpVote = (questionId) => {
    const question = questionData.find((item) => item.id === questionId);
    if (question?.upVote?.includes(auth?.user?.id)) {
      const newQuestionData = questionData.map((item) => {
        if (item.id === questionId) {
          return {
            ...item,
            upVote: item.upVote.filter((item) => item !== auth?.user?.id),
          };
        }
        return item;
      });
      setQuestionData(newQuestionData);
      return;
    }
    const newQuestionData = questionData.map((item) => {
      if (item.id === questionId) {
        return {
          ...item,
          upVote: [...item.upVote, auth?.user?.id],
        };
      }
      return item;
    });
    setQuestionData(newQuestionData);
  };

  useEffect(() => {
    return () => handleEndShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", handleEndShow);

    return () => {
      window.removeEventListener("beforeunload", handleEndShow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderQuestionType = () => {
    const type = presentation?.data?.slide[currentSlide]?.type;
    switch (type) {
      case SlideType.MULTIPLE_CHOICE: {
        const options = {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: presentation?.name,
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
          labels: presentation
            ? presentation.data.slide[currentSlide]?.answer.map(
                (item) => item.value
              )
            : [],
          datasets: [
            {
              data: presentation
                ? presentation.data.slide[currentSlide]?.answer.map(
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
              {presentation?.data?.slide[currentSlide]?.question}
            </p>
            <Bar options={options} data={chartData} />
          </>
        );
      }
      case SlideType.HEADING:
        return (
          <>
            <p className="break-all text-[40px]">
              {presentation?.data?.slide[currentSlide]?.question}
            </p>
            <p className="break-all mt-2 text-[20px]">
              {presentation?.data?.slide[currentSlide]?.paragraph}
            </p>
            <div className="flex items-center justify-center mt-5">
              {presentation?.data?.slide[currentSlide]?.icon.map(({ type }) => {
                const Icon = Reaction.find((item) => item.type === type)?.Icon;
                return (
                  <div
                    key={type}
                    className={
                      "flex items-center justify-center w-12 h-12 bg-[#495e54] drop-shadow-md rounded-full mr-3 transition-all duration-200 relative"
                    }
                  >
                    <Icon className="text-white text-[20px]" />
                    {presentation?.data?.slide[currentSlide]?.icon?.find(
                      (item) => item?.type === type
                    )?.amount > 0 && (
                      <div className="absolute -top-1 -right-1 rounded-full min-w-4 px-1 h-4 flex items-center justify-center bg-white text-[#495e54] drop-shadow-md text-[10px]">
                        {
                          presentation?.data?.slide[currentSlide]?.icon?.find(
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
              {presentation?.data?.slide[currentSlide]?.question}
            </p>
            <p className="break-all mt-2 text-[30px]">
              {presentation?.data?.slide[currentSlide]?.paragraph}
            </p>
            <div className="flex items-center justify-center mt-5">
              {presentation?.data?.slide[currentSlide]?.icon.map(({ type }) => {
                const Icon = Reaction.find((item) => item.type === type)?.Icon;
                return (
                  <div
                    key={type}
                    className={
                      "flex items-center justify-center w-12 h-12 bg-[#495e54] drop-shadow-md rounded-full mr-3 transition-all duration-200 relative"
                    }
                  >
                    <Icon className="text-white text-[20px]" />
                    {presentation?.data?.slide[currentSlide]?.icon?.find(
                      (item) => item?.type === type
                    )?.amount > 0 && (
                      <div className="absolute -top-1 -right-1 rounded-full min-w-4 px-1 h-4 flex items-center justify-center bg-white text-[#495e54] drop-shadow-md text-[10px]">
                        {
                          presentation?.data?.slide[currentSlide]?.icon?.find(
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
                presentation?.data?.slide.map((item, index) => (
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
      <div className="fixed bottom-10 right-5 ">
        <div className="flex items-center gap-x-2">
          <div
            onClick={() => setOpenQuestionDrawer(true)}
            className="w-12 h-12 bg-[#495e54] rounded-full cursor-pointer hover:opacity-80"
          >
            <div className="flex items-center justify-center w-full h-full">
              <QuestionCircleOutlined className="text-white text-[24px]" />
            </div>
          </div>
          <div
            onClick={handleOpenChatDrawer}
            className="w-12 h-12 bg-[#495e54] rounded-full cursor-pointer hover:opacity-80"
          >
            <div className="flex items-center justify-center w-full h-full">
              <WechatOutlined className="text-white text-[24px]" />
            </div>
          </div>
          <div
            onClick={() => setHistoryDrawer(true)}
            className="w-12 h-12 bg-[#495e54] rounded-full cursor-pointer hover:opacity-80"
          >
            <div className="flex items-center justify-center w-full h-full">
              <HistoryOutlined className="text-white text-[24px]" />
            </div>
          </div>
        </div>
      </div>
      <Drawer
        placement="right"
        width={400}
        onClose={() => setOpenChatDrawer(false)}
        visible={openChatDrawer}
        closable={false}
        bodyStyle={{ padding: 0, overflow: "hidden" }}
      >
        <Spin spinning={isFetching}>
          <Chat
            containerRef={containerRef}
            handleScroll={handleScroll}
            chatData={chatData}
            handleSentMessage={handleSentMessage}
          />
        </Spin>
      </Drawer>
      <Drawer
        placement="right"
        width={600}
        onClose={() => setOpenQuestionDrawer(false)}
        visible={openQuestionDrawer}
        closable={false}
        bodyStyle={{ padding: 0, overflow: "hidden" }}
      >
        <Spin spinning={isFetching}>
          <Question data={questionData} handleUpVote={handleUpVote} />
        </Spin>
      </Drawer>
      <Drawer
        placement="right"
        width={400}
        onClose={() => setHistoryDrawer(false)}
        visible={historyDrawer}
        closable={false}
        bodyStyle={{ padding: 0, overflow: "hidden" }}
      >
        <Spin spinning={isFetching}>
          <History />
        </Spin>
      </Drawer>
    </>
  );
};

export default Present;
