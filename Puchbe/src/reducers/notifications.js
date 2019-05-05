const reducer = (
  state = {
    data: null,
    paginate: {
      feedDone: false,
      lastDoc: null
    }
  },
  action
) => {
  if (action.type === "setPaginationToNotifications") {
    return { ...state, paginate: action.payload };
  }

  if (action.type === "newNotificationFeed") {
    return { ...state, data: action.payload };
  }

  if (action.type === "continueNotificationFeed") {
    return { ...state, data: [...state.data, ...action.payload] };
  }

  return state;
};

export default reducer;
