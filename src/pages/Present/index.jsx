import React, { useContext } from "react";
import { SlideType } from "src/helpers/slide";
import { WechatOutlined } from "@ant-design/icons";
import { Drawer, Input } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { emitJoinChat } from "src/socket/emit";
import { SocketContext } from "src/socket/context";

const Present = () => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [chatMessage, setChatMessage] = React.useState("");

  const data = {
    id: 1,
    type: SlideType.MULTIPLE_CHOICE,
    question: "What is your favorite color?",
    answer: [
      "Red",
      "Blue",
      "Green",
      "Yellow",
      "Red",
      "Blue",
      "Green",
      "Yellow",
    ],
  };

  const [chatData, setChatData] = useState([
    {
      userId: 1,
      name: "Name",
      message:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
      userId: 2,
      name: "Name",
      message:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
      userId: 1,
      name: "Name",
      message:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    },
    {
      userId: 1,
      name: "Name",
      message: "Lorem ipsum dolor quod.",
    },
    {
      userId: 2,
      name: "Name",
      message: "Lorem ipsum dolog elit. Quisquam, quod.",
    },
    {
      userId: 1,
      name: "Name",
      message: "Lo quod.",
    },
  ]);

  const [activeAnswer, setActiveAnswer] = React.useState(null);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    emitJoinChat(socket, "test124");
    const chatBox = document.getElementById("chat-box");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [chatData]);

  return (
    <>
      <div style={{ height: "calc(100vh - 64px)" }}>
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
        bodyStyle={{ padding: 0 }}
      >
        <div className="h-full">
          <div
            id="chat-box"
            className="h-[90%] my-5 overflow-auto px-4 hide-scrollbar"
          >
            {chatData.map((chat, index) => (
              <div key={index}>
                {chat.userId === 1 ? (
                  <div className="flex justify-end">
                    <div className="mb-5 text-end p-2 border border-[#495e54] rounded-lg inline-block">
                      <strong>{chat.name}</strong>
                      <p className="text-left">{chat.message}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-5 bg-[#495e54] p-2 rounded-lg inline-block">
                    <strong className="text-white">{chat.name}</strong>
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setChatData([
                    ...chatData,
                    {
                      userId: 1,
                      name: "Name",
                      message: chatMessage,
                    },
                  ]);
                  setChatMessage("");
                }
              }}
              className="app-input !m-0"
              placeholder="Chat..."
            />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Present;
