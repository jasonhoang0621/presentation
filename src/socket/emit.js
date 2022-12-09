export const editSendMessage = (socket, presentationId) => {
  socket?.emit(`chat-${presentationId}`, { presentationId });
};

export const emitPickAnswer = (socket, presentationId, index) => {
  socket?.emit(`present-${presentationId}`, { presentationId, index });
};
