function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
function updateGridPlaceholders() {
  const container = document.querySelector(".categories-block__content");
  if (!container) {
    console.warn("Контейнер .categories-block не найден");
    return;
  }
  const items = container.querySelectorAll(".categories-block__item");
  const existingPlaceholders = container.querySelectorAll(".grid-placeholder");
  existingPlaceholders.forEach((placeholder) => placeholder.remove());
  const computedStyle = getComputedStyle(container);
  const gridColumns = computedStyle.gridTemplateColumns.split(" ").length;
  if (!gridColumns || gridColumns === 0) {
    console.warn("Не удалось определить количество колонок");
    return;
  }
  const rows = Math.ceil(items.length / gridColumns);
  const totalCells = gridColumns * rows;
  const emptyCells = totalCells - items.length;
  for (let i = 0; i < emptyCells; i++) {
    const placeholder = document.createElement("div");
    placeholder.classList.add("grid-placeholder");
    container.appendChild(placeholder);
  }
}
document.addEventListener("DOMContentLoaded", updateGridPlaceholders);
const debouncedUpdate = debounce(updateGridPlaceholders, 200);
window.addEventListener("resize", debouncedUpdate);
