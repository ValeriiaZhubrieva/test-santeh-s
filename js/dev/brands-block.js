document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll("[data-filter-parent]");
  if (!filters.length) return;
  filters.forEach((block) => {
    const filterButtons = block.querySelectorAll("[data-filter]");
    const products = block.querySelectorAll("[data-category]");
    if (filterButtons.length && products.length) {
      let showAllProducts2 = function() {
        products.forEach((product) => {
          if (product.style.display === "none") {
            product.style.display = "flex";
            product.style.opacity = "0";
            product.style.transform = "scale(0.95)";
          }
        });
        requestAnimationFrame(() => {
          products.forEach((product, index) => {
            setTimeout(() => {
              product.style.opacity = "1";
              product.style.transform = "scale(1)";
            }, index * 10);
          });
        });
        setTimeout(() => {
          updateSwiper2(block);
        }, 150);
      }, filterProducts2 = function(filter) {
        const hidePromises = [];
        products.forEach((product) => {
          const categories = product.dataset.category.split(" ");
          const isMatch = categories.includes(filter);
          if (!isMatch) {
            product.style.opacity = "0";
            product.style.transform = "scale(0.95)";
            const promise = new Promise((resolve) => {
              setTimeout(() => {
                product.style.display = "none";
                resolve();
              }, 100);
            });
            hidePromises.push(promise);
          }
        });
        Promise.all(hidePromises).then(() => {
          products.forEach((product, index) => {
            const categories = product.dataset.category.split(" ");
            const isMatch = categories.includes(filter);
            if (isMatch) {
              if (product.style.display === "none") {
                product.style.display = "flex";
                product.style.opacity = "0";
                product.style.transform = "scale(0.95)";
              }
              setTimeout(() => {
                product.style.opacity = "1";
                product.style.transform = "scale(1)";
              }, index * 10);
            }
          });
          setTimeout(() => {
            updateSwiper2(block);
          }, 150);
        });
      }, updateSwiper2 = function(container) {
        const swiperContainers = container.querySelectorAll(".swiper");
        swiperContainers.forEach((swiperEl) => {
          if (swiperEl.swiper) {
            swiperEl.swiper.update();
            swiperEl.swiper.updateSize();
            swiperEl.swiper.updateSlides();
            if (swiperEl.swiper.navigation) {
              swiperEl.swiper.navigation.update();
            }
            if (swiperEl.swiper.pagination) {
              swiperEl.swiper.pagination.render();
              swiperEl.swiper.pagination.update();
            }
            if (swiperEl.swiper.scrollbar) {
              swiperEl.swiper.scrollbar.updateSize();
            }
            swiperEl.swiper.slideTo(0, 0);
          }
        });
      };
      var showAllProducts = showAllProducts2, filterProducts = filterProducts2, updateSwiper = updateSwiper2;
      products.forEach((product) => {
        product.style.transition = "opacity 0.3s ease, transform 0.3s ease, background 0.3s ease";
      });
      filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const filter = btn.dataset.filter;
          filterButtons.forEach((b) => b.classList.remove("is-active"));
          btn.classList.add("is-active");
          if (filter === "all") {
            showAllProducts2();
          } else {
            filterProducts2(filter);
          }
        });
      });
    }
  });
});
