const searchBlocks = document.querySelectorAll(".search-block");
if (searchBlocks.length) {
  searchBlocks.forEach((search) => {
    const searchInput = search.querySelector(".search-block__input");
    const searchResults = search.querySelector(".search-block__results");
    document.addEventListener("click", (e) => {
      const isClickInsideField = e.target.closest(".search-block__field");
      const isClickInsideResults = e.target.closest(".search-block__results");
      const isClickSearchReset = e.target.closest(".search-block__reset");
      if (!isClickInsideField && !isClickInsideResults) {
        searchResults.classList.remove("is-open");
        search.classList.remove("is-active");
      } else if (isClickSearchReset) {
        searchResults.classList.remove("is-open");
        search.classList.remove("is-active");
        searchInput.value = "";
        searchInput.parentElement.classList.remove("is-filled");
      }
    });
    searchInput.addEventListener("focus", (e) => {
      if (e.currentTarget.value.length > 0) {
        searchResults.classList.add("is-open");
        search.classList.add("is-active");
      }
    });
  });
}
