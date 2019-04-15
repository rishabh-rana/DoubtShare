import mixpanel from "mixpanel-browser";
import { MixpanelKey } from "./keys";

mixpanel.init(MixpanelKey.key);

export default mixpanel;
