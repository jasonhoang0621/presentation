export const editSendMessage = (socket, presentationId, message) => {
  socket?.emit("chat", { presentationId, message });
};

export const postQuestion = (socket, presentationId, question) => {
  socket?.emit("question", { presentationId, question });
};

export const updateQuestion = (socket, presentationId, questionId, question) => {
  socket?.emit("update-question", { presentationId, questionId, question });
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

export const answerQuestion = (socket, presentationId, index, answerIndex, name = null) => {
  if (name === null) {
    socket?.emit("answer", { presentationId, index, answerIndex });
  } else {
    socket?.emit("answer", { presentationId, index, answerIndex, name });
  }
};

export const emitChangePresentStatus = (socket, presentationId, status) => {
  socket?.emit("presentStatus", { presentationId, status });
};
