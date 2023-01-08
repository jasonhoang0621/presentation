import { QuestionCircleOutlined, WechatOutlined } from '@ant-design/icons';
import { Drawer, notification, Spin } from 'antd';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetListChat } from 'src/api/chat';
import { useDetailGroup } from 'src/api/group';
import { useDetailPresentation } from 'src/api/presentation';
import Chat from 'src/components/Present/Chat';
import Question from 'src/components/Present/Question';
import { SlideType } from 'src/helpers/slide';
import { SocketContext } from 'src/socket/context';
import { editSendMessage, postQuestion, updateQuestion } from 'src/socket/emit';
import {
  listenChat,
  listenPresentation,
  listenPresentStatus,
  listenQuestion,
  listenUpdateQuestion
} from 'src/socket/listen';
import {
  offChat,
  offPresentation,
  offPresentStatus,
  offQuestion,
  offUpdateQuestion
} from 'src/socket/off';
import Heading from '../../components/Join/Heading';
import MultipleChoice from '../../components/Join/MultiplceChoice';
import { useTranslation } from 'react-i18next';
import { useGetListQuestion } from 'src/api/question';
const Join = () => {
  const auth = useSelector((state) => state.auth);
  const { presentationId, groupId } = useParams();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [chatLength, setChatLength] = useState(0);
  const containerRef = React.useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [noPresent, setNoPresent] = useState(false);
  const [data, setData] = useState(null);
  const [openQuestionDrawer, setOpenQuestionDrawer] = useState(false);
  const [user, setUser] = useState({
    role: 'member'
  });
  const guestId = null;
  const username = null;
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();

  const { data: groupDetailData } = useDetailGroup(groupId);

  const { data: presentationData } = useDetailPresentation(presentationId);

  const [chatData, setChatData] = useState([]);
  const { data: chat, isFetching } = useGetListChat(
    presentationId,
    chatLength,
    chatLength > 20 ? 5 : 20
  );

  const [questionLength, setQuestionLength] = useState(0);
  const { data: questions, isFetching: isFetchingQuestion } = useGetListQuestion(
    presentationId,
    questionLength,
    questionLength > 20 ? 5 : 20
  );
  const [questionData, setQuestionData] = useState([]);
  const { socket } = useContext(SocketContext);

  const handleUpVote = (e, questionId) => {
    e.stopPropagation();
    const question = questionData.find(
      (item) => item.id === questionId || (guestId && item.id === guestId)
    );
    let temp = null;
    if (
      question?.upVote?.includes(auth?.user?.id) ||
      (guestId && question?.upVote?.includes(guestId))
    ) {
      const newQuestionData = questionData.map((item) => {
        if (item.id === questionId) {
          temp = item;
          if (guestId) {
            temp.upVote = item.upVote.filter((item) => item !== guestId);
          } else {
            temp.upVote = item.upVote.filter((item) => item !== auth?.user?.id);
          }
          return {
            ...temp
          };
        }
        return item;
      });
      setQuestionData(newQuestionData);
      delete temp._id;
      updateQuestion(socket, presentationId, questionId, temp);
      return;
    }
    const newQuestionData = questionData.map((item) => {
      if (item.id === questionId || (guestId && item.id === guestId)) {
        temp = item;
        temp.upVote = [...item.upVote, guestId ? guestId : auth?.user?.id];
        return {
          ...temp
        };
      }
      return item;
    });
    delete temp._id;
    updateQuestion(socket, presentationId, questionId, temp, guestId, username);
    setQuestionData(newQuestionData);
  };

  const handleAnswerQuestion = (questionId, answerContent) => {
    if (!answerContent) return;
    let temp = null;
    const newQuestionData = questionData.map((item) => {
      if (item.id === questionId) {
        temp = item;
        temp.answer = [
          ...item.answer,
          {
            id: item.answer.length + 1,
            name: username ? username : auth?.user?.name,
            content: answerContent
          }
        ];
        delete temp._id;
        return {
          ...temp
        };
      }
      return item;
    });

    updateQuestion(socket, presentationId, questionId, temp);
    setQuestionData(newQuestionData);
  };

  const handleAddQuestion = (question) => {
    if (!question) return;
    postQuestion(socket, presentationId, question, guestId, username);
  };

  const handleMarkAsAnswered = (e, questionId, setConfirmMark) => {
    e.stopPropagation();
    setConfirmMark(null);
    let temp = null;
    const newQuestionData = questionData.map((item) => {
      if (item.id === questionId) {
        temp = item;
        temp.isLock = true;
        delete temp._id;
        return {
          ...temp
        };
      }
      return item;
    });
    updateQuestion(socket, presentationId, questionId, temp);
    setQuestionData(newQuestionData);
  };

  useEffect(() => {
    if (!chat) return;
    setChatData((chatData) => [...chat.data, ...chatData]);
  }, [chat]);

  useEffect(() => {
    if (!socket) return;
    listenPresentation(socket, presentationId, (data) => {
      setSlideIndex(data?.data?.index);
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
    listenPresentStatus(socket, presentationId, (data) => {
      if (data?.status) {
        notification.info({
          message: t('This presentation is presenting')
        });
        // queryClient.invalidateQueries(['presentation', presentationId]);
        setNoPresent(false);
        return;
      }
      setNoPresent(true);
      notification.info({
        message: t('This presentation has been stopped')
      });
    });
    return () => {
      offChat(socket, presentationId);
      offPresentation(socket, presentationId);
      offPresentStatus(socket, presentationId);
    };
  }, [socket, presentationId, chatData, queryClient]);

  useEffect(() => {
    if (!socket) return;
    listenQuestion(socket, presentationId, (response) => {
      if (!response?.errorCode) {
        setQuestionData([response.data, ...questionData]);
        setQuestionLength(questionLength + 1);
      }
    });
    listenUpdateQuestion(socket, presentationId, (response) => {
      if (!response?.errorCode) {
        let newQuestionData = [];
        questionData.forEach((item) => {
          if (item.id === response.data.id) {
            newQuestionData.push(response?.data);
          } else {
            newQuestionData.push(item);
          }
        });
        setQuestionData(newQuestionData);
      }
    });

    return () => {
      offQuestion(socket, presentationId);
      offUpdateQuestion(socket, presentationId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, presentationId, questionData]);

  useEffect(() => {
    if (!questions) return;
    setQuestionData([...questionData, ...questions.data]);
  }, [questions]);

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
      const chatBox = document.getElementById('chat-box');
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
      toast(data?.data?.user[0].name + ': ' + data?.data?.message, {
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
    listenPresentStatus(socket, presentationId, (data) => {
      if (data?.status) {
        notification.info({
          message: t('This presentation is presenting')
        });
        queryClient.invalidateQueries(['presentation', presentationId]);
        setNoPresent(false);
        return;
      }
      setNoPresent(true);
      notification.info({
        message: t('This presentation has been stopped')
      });
    });
    return () => {
      offChat(socket, presentationId);
      offPresentation(socket, presentationId);
      offPresentStatus(socket, presentationId);
    };
  }, [socket, presentationId, chatData, queryClient]);

  useEffect(() => {
    setTimeout(() => {
      const chatBox = document.getElementById('chat-box');
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 2000);
  }, []);

  useEffect(() => {
    if (data) {
      if (data?.data?.slideIndex === null) {
        notification.error({
          description: t('Presentation not found')
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

  useEffect(() => {
    if (groupDetailData) {
      const temp = groupDetailData.data.user.filter((item) => item.id === auth?.user?.id);
      setUser({
        role: temp[0]?.role ?? 'member'
      });
    }
  }, [auth, groupDetailData]);

  const renderSlide = useMemo(() => {
    if (!data) return;
    switch (data?.data?.slide[slideIndex]?.type) {
      case SlideType.MULTIPLE_CHOICE:
        return <MultipleChoice data={data?.data?.slide[slideIndex]} socket={socket} />;
      case SlideType.HEADING:
      case SlideType.PARAGRAPH:
        return <Heading data={data?.data?.slide[slideIndex]} socket={socket} />;
      default:
        return <div className='text-center mt-5 text-2xl'>{t('Slide not found')}</div>;
    }
  }, [slideIndex, data, socket]);
  return (
    <>
      {noPresent ? (
        <div className='h-screen flex items-center justify-center'>
          <p className='text-[40px]'>{t('Waiting for the host to present')}</p>
        </div>
      ) : (
        <>
          <div className='px-[15vw]' style={{ height: 'calc(100vh - 64px)' }}>
            {renderSlide}
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
                onClick={() => setOpenDrawer(true)}
                className='w-12 h-12 bg-[#495e54] rounded-full cursor-pointer hover:opacity-80'
              >
                <div className='flex items-center justify-center w-full h-full'>
                  <WechatOutlined className='text-white text-[24px]' />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Drawer
        placement='right'
        width={400}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        closable={false}
        bodyStyle={{ padding: 0, overflow: 'hidden' }}
      >
        <Spin spinning={isFetching}>
          <Chat
            containerRef={containerRef}
            chatData={chatData}
            handleScroll={handleScroll}
            handleSentMessage={handleSentMessage}
          />
        </Spin>
      </Drawer>
      <Drawer
        placement='right'
        width={600}
        onClose={() => setOpenQuestionDrawer(false)}
        open={openQuestionDrawer}
        closable={false}
        bodyStyle={{ padding: 0 }}
      >
        <Spin spinning={isFetchingQuestion}>
          <Question
            presentationId={presentationId}
            socket={socket}
            questionData={questionData}
            handleUpVote={handleUpVote}
            handleAnswerQuestion={handleAnswerQuestion}
            handleAddQuestion={handleAddQuestion}
            handleMarkAsAnswered={handleMarkAsAnswered}
            role={user?.role}
          />
        </Spin>
      </Drawer>
    </>
  );
};

export default Join;
