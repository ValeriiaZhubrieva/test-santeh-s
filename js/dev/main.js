import "./inputmask.min.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
window.inputMask = function() {
  const inputMasks = document.querySelectorAll("input[data-fls-input-mask]");
  inputMasks.forEach((input) => {
    const maskAttr = input.dataset.flsInputMask;
    if (maskAttr.startsWith("+")) {
      Inputmask(maskAttr).mask(input);
      return;
    }
    if (maskAttr.startsWith("price")) {
      let currency = "₴";
      const parts = maskAttr.split(":");
      if (parts[1]) {
        currency = parts[1].trim();
      }
      Inputmask({
        alias: "numeric",
        groupSeparator: " ",
        autoGroup: true,
        digits: 0,
        digitsOptional: false,
        prefix: "",
        suffix: " " + currency,
        placeholder: "",
        rightAlign: false,
        allowMinus: false,
        autoUnmask: true
      }).mask(input);
      return;
    }
  });
};
if (document.querySelector("input[data-fls-input-mask]")) {
  window.addEventListener("load", window.inputMask);
}
