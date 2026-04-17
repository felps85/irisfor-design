import { SITE_CONFIG, buildStartIrisHostHref, resolveSiteHref } from "./site-config.js";

const hostParam = new URLSearchParams(window.location.search).get("host");
const nextHref = hostParam
  ? buildStartIrisHostHref(hostParam, "../")
  : resolveSiteHref(SITE_CONFIG.startIrisHref, "../");

window.location.replace(nextHref);
