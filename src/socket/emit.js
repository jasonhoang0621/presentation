export const emitJoinRoom = (socket, chatCode) => {
  socket?.emit('joinRoom', { chatCode });
};

export const emitJoinChat = (socket, id) => {
  console.log('test')
  socket?.emit('chatInit', {id: id});
};

export const emitLeftRoom = (socket, chatCode) => {
  socket?.emit('leftRoom', { chatCode });
};

export const emitTyping = (socket, chatCode) => {
  socket?.emit('typing', { chatCode });
};

export const emitStopTyping = (socket, chatCode) => {
  socket?.emit('stopTyping', { chatCode });
};
