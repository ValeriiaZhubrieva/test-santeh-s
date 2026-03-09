import { t as tippy } from "./tippy.js.min.js";
document.querySelector("[data-fls-tippy-content]") ? tippy("[data-fls-tippy-content]", {
  content: (reference) => reference.getAttribute("data-fls-tippy-content")
}) : null;
