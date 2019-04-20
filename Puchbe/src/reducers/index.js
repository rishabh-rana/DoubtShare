import { combineReducers } from "redux";

import error from "./error";
import auth from "./auth";
import feed from "./feed";
import ask from "./ask";
import notif from "./notifications";

export default combineReducers({
  error: error,
  auth: auth,
  feed: feed,
  ask: ask,
  notifications: notif
});
