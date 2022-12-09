export const offUserJoin = (socket) => {
  socket?.off("userJoin", () => {});
  return true;
};

export const offPresentation = (socket, presentationId) => {
  socket.off(`present-${presentationId}`);

  return true;
};

export const offChat = (socket, presentationId) => {
  socket.off(`chat-${presentationId}`);
  return true;
};
