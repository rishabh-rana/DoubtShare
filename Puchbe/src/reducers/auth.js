const reducer = (
  state = {
    uid:
      localStorage.getItem("uid") === null ||
      localStorage.getItem("uid") === "null"
        ? null
        : localStorage.getItem("uid"),
    displayName:
      localStorage.getItem("name") === null ||
      localStorage.getItem("name") === "null"
        ? "User"
        : localStorage.getItem("name")
  },
  action
) => {
  if (action.type === "syncusers") {
    if (action.payload) {
      localStorage.setItem("uid", action.payload.uid);
      localStorage.setItem("name", action.payload.displayName);
      return {
        ...state,
        uid: action.payload.uid,
        displayName: action.payload.displayName
      };
    } else {
      localStorage.setItem("uid", null);
      localStorage.setItem("name", null);
      return {
        ...state,
        uid: null,
        displayName: "User"
      };
    }
  }
  return state;
};

export default reducer;
