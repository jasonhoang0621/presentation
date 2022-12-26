export const editSendMessage = (socket, presentationId, message) => {
  socket?.emit("chat", { presentationId, message });
};

export const emitPickAnswer = (socket, presentationId, index) => {
  socket?.emit("pickAnswer", { presentationId, index });
};

export const createPresentation = (socket, presentationId) => {
  socket?.emit("initPresent", { presentationId });
  return true;
};

export const changeSlide = (socket, presentationId, index) => {
  socket?.emit("present", { presentationId, index });
};

export const answerQuestion = (socket, presentationId, index, answerIndex) => {
  socket?.emit("answer", { presentationId, index, answerIndex });
};
