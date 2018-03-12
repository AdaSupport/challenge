// simple way to generate a new unique id
export const ID  = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
}