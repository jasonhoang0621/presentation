export const listenPresentation = (socket, presentationId, cb) => {
  socket
    .off(`present-${presentationId}`)
    .on(`present-${presentationId}`, function (data) {
      cb(data);
    });
  return true;
};

export const listenChat = (socket, presentationId, cb) => {
  socket
    .off(`chat-${presentationId}`)
    .on(`chat-${presentationId}`, function (data) {
      cb(data);
    });
  return true;
};
