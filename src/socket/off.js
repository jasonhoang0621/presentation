export const offUserJoin = (socket) => {
  socket?.off('userJoin', () => {});
  return true;
};

export const offUserLeft = (socket) => {
  socket?.off('userLeft', () => {});
  return true;
};

export const offTyping = (socket) => {
  socket?.off('typing', () => {});
  return true;
};

export const offStopTyping = (socket) => {
  socket?.off('stopTyping', () => {});
  return true;
};

export const offNewMessage = (socket) => {
  socket?.off('newMessage', () => {});
  return true;
};
