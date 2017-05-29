export default socket => store => next => action => {
  socket.emit('action', action);

  return next(action);
}
