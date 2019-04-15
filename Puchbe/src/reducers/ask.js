const reducer = (
  state = {
    uploading: false
  },
  action
) => {
  //do something
  if (action.type === "uploaded") {
    console.log(Date.now());
    return { ...state, uploading: false };
  }
  if (action.type === "uploading") {
    return { ...state, uploading: true };
  }
  return state;
};

export default reducer;
