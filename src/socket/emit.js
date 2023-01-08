export const editSendMessage = (socket, presentationId, message, name = null, guestId = null) => {
  if (name) {
    socket?.emit('chat', { presentationId, message, name, guestId });
  } else {
    socket?.emit('chat', { presentationId, message });
  }
};

export const postQuestion = (socket, presentationId, question, guestId = null, name = null) => {
  if (!guestId) {
    socket?.emit('question', { presentationId, question });
  } else {
    socket?.emit('question', { presentationId, question, guestId, name });
  }
};

export const updateQuestion = (
  socket,
  presentationId,
  questionId,
  question,
  guestId = null,
  name = null
) => {
  if (!guestId) {
    socket?.emit('update-question', { presentationId, questionId, question });
  } else {
    socket?.emit('update-question', { presentationId, questionId, question, guestId, name });
  }
};

export const emitPickAnswer = (socket, presentationId, index) => {
  socket?.emit('pickAnswer', { presentationId, index });
};

export const createPresentation = (socket, presentationId) => {
  socket?.emit('initPresent', { presentationId });
  return true;
};

export const changeSlide = (socket, presentationId, index) => {
  socket?.emit('present', { presentationId, index });
};

export const answerQuestion = (
  socket,
  presentationId,
  index,
  answerIndex,
  name = null,
  guestId = null
) => {
  if (name === null) {
    socket?.emit('answer', { presentationId, index, answerIndex });
  } else {
    socket?.emit('answer', { presentationId, index, answerIndex, name, guestId });
  }
};

export const emitChangePresentStatus = (socket, presentationId, status) => {
  socket?.emit('presentStatus', { presentationId, status });
};
