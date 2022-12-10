export const editSendMessage = (socket, presentationId) => {
  socket?.emit(`chat-${presentationId}`, { presentationId });
};

export const emitPickAnswer = (socket, presentationId, index) => {
  socket?.emit(`present-${presentationId}`, { presentationId, index });
};

export const createPresentation = (socket, presentationId) => {
  socket?.emit("present", { presentationId });
};

export const changeSlide = (socket, presentationId, index) => {
  socket?.emit(`present-${presentationId}`, { index, presentationId });
};
