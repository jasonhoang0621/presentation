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

export const listenAnswer = (socket, presentationId, index = 0, cb) => {
  socket
    .off(`answer-${presentationId}-${index}`)
    .on(`answer-${presentationId}-${index}`, function (data) {
      cb(data);
    });
  return true;
};

export const listenPresentStatus = (socket, presentationId, cb) => {
  socket
    .off(`presentStatus-${presentationId}`)
    .on(`presentStatus-${presentationId}`, function (data) {
      cb(data);
    });
  return true;
};
