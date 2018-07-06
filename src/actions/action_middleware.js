export default socket => store => next => action => {
  if (action.remote) {
    socket.emit('action', action);
  }

  return next(action);
}
