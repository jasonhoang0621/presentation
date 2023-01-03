import { Input } from "antd";
import React from "react";
import { useSelector } from "react-redux";

const Chat = ({ containerRef, handleScroll, chatData, handleSentMessage }) => {
  const auth = useSelector((state) => state.auth);
  const [chatMessage, setChatMessage] = React.useState("");

  return (
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
              {chat.userId === auth?.user?.id ||
              chat.userId === localStorage.getItem("guestId") ? (
                <div className="flex justify-end">
                  <div className="mb-5 text-end p-2 border border-[#495e54] rounded-lg inline-block">
                    <strong>
                      {chat.user.length === 1
                        ? chat.user[0].name
                        : chat.guest[0].name}
                    </strong>
                    <p className="text-left">{chat.message}</p>
                  </div>
                </div>
              ) : (
                <div className="mb-5 bg-[#495e54] p-2 rounded-lg inline-block">
                  <strong className="text-white">
                    {chat.user.length === 1
                      ? chat.user[0].name
                      : chat.guest[0].name}
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSentMessage(chatMessage);
              setChatMessage("");
            }
          }}
          className="app-input !m-0"
          placeholder="Chat..."
        />
      </div>
    </div>
  );
};

export default Chat;
