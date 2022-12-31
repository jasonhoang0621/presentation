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

export const offQuestion = (socket, presentationId) => {
  socket.off(`question-${presentationId}`);
  return true;
};

export const offAnswer = (socket, presentationId, index) => {
  socket.off(`answer-${presentationId}-${index}`);
  return true;
};

export const offPresentStatus = (socket, presentationId) => {
  socket.off(`presentStatus-${presentationId}`);
  return true;
};
