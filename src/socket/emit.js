export const editSendMessage = (socket, presentationId, message) => {
  console.log("editSendMessage", presentationId, message)
  socket?.emit(`chat-${presentationId}`, { presentationId, message });
};

export const emitPickAnswer = (socket, presentationId, index) => {
  socket?.emit(`present-${presentationId}`, { presentationId, index });
};

export const createPresentation = (socket, presentationId) => {
  socket?.emit("present", { presentationId });
  return true
};

export const changeSlide = (socket, presentationId, index) => {
  console.log("changeSlide", presentationId, index)
  socket?.emit(`present-${presentationId}`, { index, presentationId });
};
