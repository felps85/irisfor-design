import "./styles.css";

import { renderProjectStatusPage } from "./project-status.js";

const app = document.querySelector("#app");

renderProjectStatusPage({
  app,
  currentPage: "home",
  rootPrefix: "./",
  pageClass: "status-page"
});
