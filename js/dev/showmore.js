import { d as dataMediaQueries, s as slideUp, e as slideDown } from "./common.min.js";
function showMore() {
  const showMoreBlocks = document.querySelectorAll("[data-fls-showmore]");
  let showMoreBlocksRegular;
  let mdQueriesArray;
  if (showMoreBlocks.length) {
    showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function(item) {
      return !item.dataset.flsShowmoreMedia;
    });
    showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
    document.addEventListener("click", showMoreActions);
    window.addEventListener("resize", showMoreActions);
    mdQueriesArray = dataMediaQueries(showMoreBlocks, "flsShowmoreMedia");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach((mdQueriesItem) => {
        mdQueriesItem.matchMedia.addEventListener("change", function() {
          initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
      });
      initItemsMedia(mdQueriesArray);
    }
    initHeightMediaQueries(showMoreBlocks);
  }
  function initHeightMediaQueries(showMoreBlocks2) {
    showMoreBlocks2.forEach((showMoreBlock) => {
      let showMoreContent = Array.from(showMoreBlock.querySelectorAll("[data-fls-showmore-content]")).filter(
        (item) => item.closest("[data-fls-showmore]") === showMoreBlock
      )[0];
      if (!showMoreContent || !showMoreContent.dataset.flsShowmoreContentMedia) return;
      const pairs = parseMediaPairs(showMoreContent.dataset.flsShowmoreContentMedia);
      pairs.forEach(({ query }) => {
        const mq = window.matchMedia(query);
        mq.addEventListener("change", function() {
          if (!showMoreBlock.dataset.flsShowmoreMedia || window.matchMedia(showMoreBlock.dataset.flsShowmoreMedia).matches) {
            reinitHeight(showMoreBlock, showMoreContent);
          }
        });
      });
    });
  }
  function reinitHeight(showMoreBlock, showMoreContent) {
    let showMoreButton = Array.from(showMoreBlock.querySelectorAll("[data-fls-showmore-button]")).filter(
      (item) => item.closest("[data-fls-showmore]") === showMoreBlock
    )[0];
    const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
    const originalHeight = getOriginalHeight(showMoreContent);
    if (originalHeight - hiddenHeight > 2) {
      showMoreButton.hidden = false;
      if (!showMoreBlock.classList.contains("--showmore-active")) {
        slideUp(showMoreContent, 0, hiddenHeight);
      }
    } else {
      slideDown(showMoreContent, 0, originalHeight);
      showMoreButton.hidden = true;
    }
  }
  function parseMediaPairs(str) {
    return str.split(",").map((pair) => {
      const colonIdx = pair.lastIndexOf(":");
      if (colonIdx === -1) return null;
      return {
        query: pair.slice(0, colonIdx).trim(),
        value: pair.slice(colonIdx + 1).trim()
      };
    }).filter(Boolean);
  }
  function getHeightFromMediaPairs(showMoreContent) {
    if (!showMoreContent.dataset.flsShowmoreContentMedia) return null;
    const pairs = parseMediaPairs(showMoreContent.dataset.flsShowmoreContentMedia);
    for (const { query, value } of pairs) {
      if (window.matchMedia(query).matches) {
        return value;
      }
    }
    return null;
  }
  function initItemsMedia(mdQueriesArray2) {
    mdQueriesArray2.forEach((mdQueriesItem) => {
      initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
    });
  }
  function initItems(showMoreBlocks2, matchMedia) {
    showMoreBlocks2.forEach((showMoreBlock) => {
      initItem(showMoreBlock, matchMedia);
    });
  }
  function initItem(showMoreBlock, matchMedia = false) {
    showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
    let showMoreContent = showMoreBlock.querySelectorAll("[data-fls-showmore-content]");
    let showMoreButton = showMoreBlock.querySelectorAll("[data-fls-showmore-button]");
    showMoreContent = Array.from(showMoreContent).filter(
      (item) => item.closest("[data-fls-showmore]") === showMoreBlock
    )[0];
    showMoreButton = Array.from(showMoreButton).filter(
      (item) => item.closest("[data-fls-showmore]") === showMoreBlock
    )[0];
    const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
    const originalHeight = getOriginalHeight(showMoreContent);
    if (matchMedia.matches || !matchMedia) {
      if (originalHeight - hiddenHeight > 2) {
        slideUp(
          showMoreContent,
          0,
          showMoreBlock.classList.contains("--showmore-active") ? originalHeight : hiddenHeight
        );
        showMoreButton.hidden = false;
      } else {
        slideDown(showMoreContent, 0, originalHeight);
        showMoreButton.hidden = true;
      }
    } else {
      slideDown(showMoreContent, 0, originalHeight);
      showMoreButton.hidden = true;
    }
  }
  function getHeight(showMoreBlock, showMoreContent) {
    let hiddenHeight = 0;
    const showMoreType = showMoreBlock.dataset.flsShowmore ? showMoreBlock.dataset.flsShowmore : "size";
    const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap) || 0;
    if (showMoreType === "items") {
      const showMoreTypeValue = getHeightFromMediaPairs(showMoreContent) || showMoreContent.dataset.flsShowmoreContent || 3;
      const showMoreItems = showMoreContent.children;
      for (let index = 1; index < showMoreItems.length; index++) {
        const showMoreItem = showMoreItems[index - 1];
        const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop) || 0;
        const marginBottom = parseFloat(getComputedStyle(showMoreItem).marginBottom) || 0;
        hiddenHeight += showMoreItem.offsetHeight + marginTop;
        if (index == showMoreTypeValue) break;
        hiddenHeight += marginBottom;
      }
      rowGap ? hiddenHeight += (showMoreTypeValue - 1) * rowGap : null;
    } else {
      const showMoreTypeValue = getHeightFromMediaPairs(showMoreContent) || showMoreContent.dataset.flsShowmoreContent || 150;
      hiddenHeight = Number(showMoreTypeValue);
    }
    return hiddenHeight;
  }
  function getOriginalHeight(showMoreContent) {
    const currentHeight = showMoreContent.offsetHeight;
    const originalHeight = showMoreContent.scrollHeight;
    showMoreContent.style.height = `${currentHeight}px`;
    return originalHeight;
  }
  function showMoreActions(e) {
    const targetEvent = e.target;
    const targetType = e.type;
    if (targetType === "click") {
      if (targetEvent.closest("[data-fls-showmore-button]")) {
        const showMoreButton = targetEvent.closest("[data-fls-showmore-button]");
        const showMoreBlock = showMoreButton.closest("[data-fls-showmore]");
        const showMoreContent = showMoreBlock.querySelector("[data-fls-showmore-content]");
        const showMoreSpeed = showMoreBlock.dataset.flsShowmoreButton ? showMoreBlock.dataset.flsShowmoreButton : "500";
        const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
        if (!showMoreContent.classList.contains("--slide")) {
          showMoreBlock.classList.contains("--showmore-active") ? slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
          showMoreBlock.classList.toggle("--showmore-active");
        }
      }
    } else if (targetType === "resize") {
      showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
      mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
    }
  }
}
window.addEventListener("load", showMore);
