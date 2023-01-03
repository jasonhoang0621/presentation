import { HistoryOutlined, QuestionCircleOutlined, WechatOutlined } from '@ant-design/icons';
import { Drawer, notification, Select, Spin } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetListChat } from 'src/api/chat';
import { useDetailGroup } from 'src/api/group';
import {
  useDetailPresentation,
  useExitPresentation,
  useGetHistory,
  usePresentPresentation
} from 'src/api/presentation';
import Chat from 'src/components/Present/Chat';
import History from 'src/components/Present/History';
import Question from 'src/components/Present/Question';
import { Reaction, SlideType } from 'src/helpers/slide';
import { SocketContext } from 'src/socket/context';
import { changeSlide, editSendMessage, emitChangePresentStatus } from 'src/socket/emit';
import { listenAnswer, listenChat, listenPresentation } from 'src/socket/listen';
import { offAnswer, offChat, offPresentation } from 'src/socket/off';

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
  const { mutateAsync: startPresent } = usePresentPresentation();
  const { data: historyData } = useGetHistory(presentationId);
  const [user, setUser] = useState({
    role: 'member'
  });

  const { data: groupDetailData } = useDetailGroup(groupId);

  const queryClient = useQueryClient();
  const { data: chat, isFetching } = useGetListChat(
    presentationId,
    chatLength,
    chatLength > 20 ? 5 : 20
  );
  const containerRef = useRef(null);
  const [presentation, setPresentation] = useState(data);

  const handleChangeSlide = (index) => {
    if (!socket) return;
    if (index === data?.data?.slide.length) {
      notification.error({
        message: 'Error',
        description: 'You are at the last slide'
      });
      return;
    }
    setCurrentSlide(index);
    changeSlide(socket, presentationId, index);
  };

  const handleEndShow = async () => {
    const res = await mutateAsync({ presentationId: presentationId });
    if (!res?.errorCode) {
      emitChangePresentStatus(socket, presentationId, false);
    }
    queryClient.invalidateQueries(['group', groupId]);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/group/${groupId}/presentation/${presentationId}/join/public`
    );
    notification.success({
      message: 'Link copied to clipboard'
    });
  };

  useEffect(() => {
    if (!chat) return;
    setChatData((chatData) => [...chat.data, ...chatData]);
  }, [chat]);

  const handleClickToast = () => {
    setOpenChatDrawer(true);
    setTimeout(() => {
      const chatBox = document.getElementById('chat-box');
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
    listenAnswer(socket, presentationId, currentSlide, (response) => {
      setPresentation(response);
    });
    listenChat(socket, presentationId, (data) => {
      toast(data?.data?.user[0]?.name + ': ' + data?.data?.message, {
        onClick: handleClickToast
      });
      setChatData([...chatData, data?.data]);
      setTimeout(() => {
        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
          chatBox.scrollTop = chatBox.scrollHeight;
        }
      }, 500);
    });
    return () => {
      offChat(socket, presentationId);
      offPresentation(socket, presentationId);
      offAnswer(socket, presentationId, currentSlide);
    };
  }, [socket, presentationId, chatData, currentSlide]);
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
            name: auth?.user?.name
          }
        ]
      }
    ]);
    editSendMessage(socket, presentationId, chatMessage);
    setTimeout(() => {
      const chatBox = document.getElementById('chat-box');
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 500);
  };

  const handleOpenChatDrawer = () => {
    setTimeout(() => {
      const chatBox = document.getElementById('chat-box');
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 500);
    setOpenChatDrawer(true);
  };

  useEffect(() => {
    if (groupDetailData) {
      const temp = groupDetailData.data.user.filter((item) => item.id === auth?.user?.id);
      setUser({
        role: temp[0]?.role ?? 'member'
      });
    }
  }, [auth, groupDetailData]);

  useEffect(() => {
    const handleStartPresent = async () => {
      const res = await startPresent({
        presentationId: presentationId
      });
      if (!res.errorCode) {
        emitChangePresentStatus(socket, presentationId, true);
      }
    };
    handleStartPresent();

    return () => handleEndShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', handleEndShow);

    return () => {
      window.removeEventListener('beforeunload', handleEndShow);
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
              text: presentation?.name
            }
          },
          tooltips: {
            display: false
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              grid: {
                display: false
              },
              ticks: {
                stepSize: 1
              }
            }
          }
        };
        const chartData = {
          labels: presentation
            ? presentation.data.slide[currentSlide]?.answer.map((item) => item.value)
            : [],
          datasets: [
            {
              data: presentation
                ? presentation.data.slide[currentSlide]?.answer.map((item) => item.amount)
                : [],
              backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }
          ],
          scaleShowLabels: false
        };
        return (
          <>
            <p className='break-all text-4xl mb-2'>
              {presentation?.data?.slide[currentSlide]?.question}
            </p>
            <Bar options={options} data={chartData} />
          </>
        );
      }
      case SlideType.HEADING:
        return (
          <>
            <p className='break-all text-[40px]'>
              {presentation?.data?.slide[currentSlide]?.question}
            </p>
            <p className='break-all mt-2 text-[20px]'>
              {presentation?.data?.slide[currentSlide]?.paragraph}
            </p>
            <div className='flex items-center justify-center mt-5'>
              {presentation?.data?.slide[currentSlide]?.answer.map(({ type }) => {
                const Icon = Reaction.find((item) => item.type === type)?.Icon;
                return (
                  <div
                    key={type}
                    className={
                      'flex items-center justify-center w-12 h-12 bg-[#495e54] drop-shadow-md rounded-full mr-3 transition-all duration-200 relative'
                    }
                  >
                    <Icon className='text-white text-[20px]' />
                    {presentation?.data?.slide[currentSlide]?.answer?.find(
                      (item) => item?.type === type
                    )?.amount > 0 && (
                      <div className='absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center bg-white text-[#495e54] drop-shadow-md text-[12px]'>
                        {
                          presentation?.data?.slide[currentSlide]?.answer?.find(
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
            <p className='break-all text-[40px]'>
              {presentation?.data?.slide[currentSlide]?.question}
            </p>
            <p className='break-all mt-2 text-[30px]'>
              {presentation?.data?.slide[currentSlide]?.paragraph}
            </p>
            <div className='flex items-center justify-center mt-5'>
              {presentation?.data?.slide[currentSlide]?.answer.map(({ type }) => {
                const Icon = Reaction.find((item) => item.type === type)?.Icon;
                return (
                  <div
                    key={type}
                    className={
                      'flex items-center justify-center w-12 h-12 bg-[#495e54] drop-shadow-md rounded-full mr-3 transition-all duration-200 relative'
                    }
                  >
                    <Icon className='text-white text-[20px]' />
                    {presentation?.data?.slide[currentSlide]?.answer?.find(
                      (item) => item?.type === type
                    )?.amount > 0 && (
                      <div className='absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center bg-white text-[#495e54] drop-shadow-md text-[10px]'>
                        {
                          presentation?.data?.slide[currentSlide]?.answer?.find(
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
      <div style={{ height: 'calc(100vh - 64px)' }} className='p-2'>
        <div className='w-full flex items-center justify-between'>
          <div className='flex items-center gap-x-2 w-[15%]'>
            <Select
              className='app-select'
              style={{ width: '100%' }}
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
          <div className='flex items-center'>
            <button onClick={handleShare} className='button button-danger !py-2 !min-w-[120px]'>
              <span className='!text-[14px]'>Share</span>
            </button>
            <button
              onClick={() => handleChangeSlide(currentSlide + 1)}
              className='button !py-2 !min-w-[120px]'
            >
              <span className='!text-[14px]'>Next</span>
            </button>
          </div>
        </div>
        <div className='w-full flex items-center justify-center'>
          <div
            className={`h-[600px] w-[90%] p-5 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden`}
          >
            {renderQuestionType()}
          </div>
        </div>
      </div>
      <div className='fixed bottom-10 right-5 '>
        <div className='flex items-center gap-x-2'>
          <div
            onClick={() => setOpenQuestionDrawer(true)}
            className='w-12 h-12 bg-[#495e54] rounded-full cursor-pointer hover:opacity-80'
          >
            <div className='flex items-center justify-center w-full h-full'>
              <QuestionCircleOutlined className='text-white text-[24px]' />
            </div>
          </div>
          <div
            onClick={handleOpenChatDrawer}
            className='w-12 h-12 bg-[#495e54] rounded-full cursor-pointer hover:opacity-80'
          >
            <div className='flex items-center justify-center w-full h-full'>
              <WechatOutlined className='text-white text-[24px]' />
            </div>
          </div>
          <div
            onClick={() => setHistoryDrawer(true)}
            className='w-12 h-12 bg-[#495e54] rounded-full cursor-pointer hover:opacity-80'
          >
            <div className='flex items-center justify-center w-full h-full'>
              <HistoryOutlined className='text-white text-[24px]' />
            </div>
          </div>
        </div>
      </div>
      <Drawer
        placement='right'
        width={400}
        onClose={() => setOpenChatDrawer(false)}
        visible={openChatDrawer}
        closable={false}
        bodyStyle={{ padding: 0, overflow: 'hidden' }}
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
        placement='right'
        width={600}
        onClose={() => setOpenQuestionDrawer(false)}
        visible={openQuestionDrawer}
        closable={false}
        bodyStyle={{ padding: 0 }}
      >
        <Spin spinning={isFetching}>
          <Question presentationId={presentationId} role={user.role} />
        </Spin>
      </Drawer>
      <Drawer
        placement='right'
        width={400}
        onClose={() => setHistoryDrawer(false)}
        visible={historyDrawer}
        closable={false}
        bodyStyle={{ padding: 0, margin: 0 }}
      >
        <Spin spinning={isFetching}>
          <History data={historyData} socket={socket} />
        </Spin>
      </Drawer>
    </>
  );
};

export default Present;
