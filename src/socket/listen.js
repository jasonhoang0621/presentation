export const listenUserJoin = (socket, cb) => {
  socket.off('userJoin').on('userJoin', function (data) {
    cb(data);
  });
  return true;
};

export const listenUserLeft = (socket, cb) => {
  socket.off('userLeft').on('userLeft', function (data) {
    cb(data);
  });
  return true;
};

export const listenTyping = (socket, cb) => {
  socket.off('typing').on('typing', function (data) {
    cb(data);
  });
  return true;
};

export const listenStopTyping = (socket, cb) => {
  socket.off('stopTyping').on('stopTyping', function (data) {
    cb(data);
  });
  return true;
};

export const listenNewMessage = (socket, cb) => {
  console.log('listenNewMessage');
  socket.off('newMessage').on('newMessage', function (data) {
    cb(data);
  });
  return true;
};

export const listenError = (socket, cb) => {
  socket.off('error').on('error', function (data) {
    cb(data);
  });
  return true;
};

export const listenNewEvent = (socket, cb) => {
  socket.off('newEvent').on('newEvent', function (data) {
    cb(data);
  });
  return true;
};

export const listenNewNetworkRequest = (socket, cb) => {
  socket.off('newEvent').on('newNetworkRequest', function (data) {
    cb(data);
  });
  return true;
};