const reducer = (
  state = {
    data: {
      points: 0
    },
    newProfile: null
  },
  action
) => {
  //do something
  if (action.type === "syncUserData") {
    return { ...state, data: action.payload };
  }
  if (action.type === "syncOtherUserData") {
    return { ...state, newProfile: action.payload };
  }

  return state;
};

export default reducer;
