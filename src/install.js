import "./styles.css";

import { renderProjectStatusPage } from "./project-status.js";

const app = document.querySelector("#app");

renderProjectStatusPage({
  app,
  currentPage: "install",
  rootPrefix: "../",
  pageClass: "status-page inner-page"
});
