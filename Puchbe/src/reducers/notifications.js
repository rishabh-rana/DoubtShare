const reducer = (
  state = {
    data: null,
    paginate: {
      feedDone: false,
      lastDoc: null
    },
    unread: 0
  },
  action
) => {
  if (action.type === "setPaginationToNotifications") {
    return { ...state, paginate: action.payload };
  }

  if (action.type === "newNotificationFeed") {
    let unread = 0;
    action.payload.forEach(notif => {
      if (!notif.read) unread++;
    });
    if (unread > 0) {
      return { ...state, data: action.payload, unread: state.unread + unread };
    }
    return { ...state, data: action.payload };
  }

  if (action.type === "continueNotificationFeed") {
    let unread = 0;
    action.payload.forEach(notif => {
      if (!notif.read) unread++;
    });
    if (unread > 0) {
      return {
        ...state,
        data: [...state.data, ...action.payload],
        unread: state.unread + unread
      };
    }
    return { ...state, data: [...state.data, ...action.payload] };
  }

  return state;
};

export default reducer;
