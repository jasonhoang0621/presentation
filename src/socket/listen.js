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

export const listenQuestion = (socket, presentationId, cb) => {
  socket
    .off(`question-${presentationId}`)
    .on(`question-${presentationId}`, function (data) {
      cb(data);
    });
  return true;
};

export const listenUpdateQuestion = (socket, presentationId, cb) => {
  socket
    .off(`update-question-${presentationId}`)
    .on(`update-question-${presentationId}`, function (data) {
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

export const listenHistory = (socket, presentationId, cb) => {
  socket
    .off(`history-${presentationId}`)
    .on(`history-${presentationId}`, function (data) {
      cb(data);
    });
  return true;
};