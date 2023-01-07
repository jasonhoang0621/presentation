import { WechatOutlined } from '@ant-design/icons';
import { Drawer, Input, notification, Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { useGetListChat } from 'src/api/chat';
import { useDetailPresentation } from 'src/api/presentation';
import Heading from 'src/components/Join/Heading';
import MultipleChoice from 'src/components/Join/MultiplceChoice';
import Chat from 'src/components/Present/Chat';
import { SlideType } from 'src/helpers/slide';
import { SOCKET_URL } from 'src/socket/context';
import { editSendMessage } from 'src/socket/emit';
import { listenChat, listenPresentation, listenPresentStatus } from 'src/socket/listen';
import { offChat, offPresentation, offPresentStatus } from 'src/socket/off';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
const PublicJoin = () => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const { groupId, presentationId } = useParams();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [chatLength, setChatLength] = useState(0);
  const containerRef = React.useRef(null);
  const [guestId, setGuestId] = useState(localStorage.getItem('guestId'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [slideIndex, setSlideIndex] = useState(0);
  const [noPresent, setNoPresent] = useState(false);
  const [data, setData] = useState(null);
  const [socket, setSocket] = useState(null);
  const [chatData, setChatData] = useState([]);

  const { data: presentationData } = useDetailPresentation(presentationId);

  const { data: chat, isFetching } = useGetListChat(
    presentationId,
    chatLength,
    chatLength > 20 ? 5 : 20
  );

  const queryClient = useQueryClient();

  const handleScroll = () => {
    if (containerRef.current.scrollTop === 0) {
      if (chatLength <= chatData.length) {
        setChatLength(chatData.length);
      }
    }
  };

  useEffect(() => {
    if (guestId) {
      setSocket(
        io(SOCKET_URL, {
          extraHeaders: {
            guestId,
            username
          }
        })
      );
    }
  }, [guestId, username]);

  const handleSentMessage = (chatMessage) => {
    const name = localStorage.getItem('username');
    const guestId = localStorage.getItem('guestId');
    setChatData([
      ...chatData,
      {
        userId: guestId,
        message: chatMessage,
        user: [
          {
            name: name
          }
        ]
      }
    ]);
    editSendMessage(socket, presentationId, chatMessage, name, guestId);
    setTimeout(() => {
      const chatBox = document.getElementById('chat-box');
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 500);
  };

  useEffect(() => {
    if (!chat) return;
    setChatData((chatData) => [...chat.data, ...chatData]);
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

  const handleSubmitName = () => {
    if (guestId) return;
    localStorage.setItem('guestId', uuidv4());
    localStorage.setItem('username', username);
    setTimeout(() => {
      setGuestId(localStorage.getItem('guestId'));
      setUsername(localStorage.getItem('username'));
    }, 500);
  };

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
    setTimeout(() => {
      const chatBox = document.getElementById('chat-box');
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 2000);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/group/${groupId}/presentation/${presentationId}/join`, {
        replace: true
      });
    }
  }, [groupId, presentationId, navigate]);

  useEffect(() => {
    if (presentationData) {
      setData(presentationData);
    }
  }, [presentationData]);

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

  const renderSlide = useMemo(() => {
    if (!data) return;
    switch (data?.data?.slide[slideIndex]?.type) {
      case SlideType.MULTIPLE_CHOICE:
        return (
          <MultipleChoice data={data?.data?.slide[slideIndex]} isPublic={true} socket={socket} />
        );
      case SlideType.HEADING:
      case SlideType.PARAGRAPH:
        return <Heading data={data?.data?.slide[slideIndex]} isPublic={true} socket={socket} />;
      default:
        return <div className='text-center mt-5 text-2xl'>{t('Slide not found')}</div>;
    }
  }, [slideIndex, data, socket]);

  if (!guestId) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='w-[50vw]'>
          <p className='pl-1'>{t('Enter your name:')}</p>
          <Input
            className='app-input'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div onClick={handleSubmitName} className='flex justify-center'>
            <button className='button !py-2 mt-2'>
              <span className='text-[14px]'>{t('Join')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <div
            onClick={() => setOpenDrawer(true)}
            className='fixed bottom-10 right-5 w-12 h-12 bg-[#495e54] rounded-full cursor-pointer hover:opacity-80'
          >
            <div className='flex items-center justify-center w-full h-full'>
              <WechatOutlined className='text-white text-[24px]' />
            </div>
          </div>
        </>
      )}
      <Drawer
        placement='right'
        width={400}
        onClose={() => setOpenDrawer(false)}
        visible={openDrawer}
        closable={false}
        bodyStyle={{ padding: 0, overflow: 'hidden' }}
      >
        <Spin spinning={isFetching}>
          <Chat
            chatData={chatData}
            containerRef={containerRef}
            handleScroll={handleScroll}
            handleSentMessage={handleSentMessage}
          />
        </Spin>
      </Drawer>
    </>
  );
};

export default PublicJoin;
