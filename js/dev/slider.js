import { S as Swiper, N as Navigation, P as Pagination, A as Autoplay, T as Thumb, a as Scrollbar } from "./swiper.min.js";
const resizableSwiper = (breakpoint, swiperElementOrClass, swiperSettings, callback) => {
  const swiperElement = typeof swiperElementOrClass === "string" ? document.querySelector(swiperElementOrClass) : swiperElementOrClass;
  if (swiperElement) {
    let swiper;
    breakpoint = window.matchMedia(breakpoint);
    const enableSwiper = function(element, settings) {
      swiper = new Swiper(element, settings);
    };
    const checker = function() {
      if (breakpoint.matches) {
        return enableSwiper(swiperElement, swiperSettings);
      } else {
        if (swiper !== void 0) swiper.destroy(true, true);
        return;
      }
    };
    breakpoint.addEventListener("change", checker);
    checker();
  }
};
function toggleLockSliderClass(swiper) {
  const nextBtn = swiper.el.parentElement.querySelector(".swiper-button-next");
  const pagination = swiper.el.parentElement.querySelector(".swiper-pagination");
  const myBlock = swiper.el.parentElement.querySelector("[data-swiper-lock]");
  if (!myBlock) return;
  if (nextBtn && nextBtn.classList.contains("swiper-button-lock") || pagination && pagination.classList.contains("swiper-pagination-lock")) {
    myBlock.classList.add("swiper-block-lock");
  } else {
    myBlock.classList.remove("swiper-block-lock");
  }
}
function syncCompareTable(swiper) {
  const compareBlock = swiper.el.closest("[data-compare]");
  if (!compareBlock) return;
  const tbody = compareBlock.querySelector("[data-compare-table] tbody");
  if (!tbody) return;
  const firstRow = tbody.querySelector(".row-data");
  if (!firstRow) return;
  const firstCell = firstRow.querySelector("td");
  if (!firstCell) return;
  const cellWidth = firstCell.offsetWidth;
  const offset = swiper.activeIndex * cellWidth;
  tbody.scrollTo({
    left: offset,
    behavior: "smooth"
  });
}
window.initSliders = function() {
  if (document.querySelector(".hero__slider")) {
    new Swiper(".hero__slider", {
      // <- Вказуємо склас потрібного слайдера
      // Підключаємо модулі слайдера
      // для конкретного випадку
      modules: [Navigation, Pagination, Autoplay],
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      spaceBetween: 10,
      //autoHeight: true,
      speed: 800,
      //touchRatio: 0,
      //simulateTouch: false,
      //loop: true,
      //preloadImages: false,
      //lazy: true,
      // Ефекти
      // effect: 'fade',
      autoplay: {
        delay: 3e3,
        disableOnInteraction: false
      },
      // Пагінація
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      // Скроллбар
      /*
      scrollbar: {
      	el: '.swiper-scrollbar',
      	draggable: true,
      },
      */
      // Кнопки "вліво/вправо"
      navigation: {
        prevEl: ".swiper-button-prev",
        nextEl: ".swiper-button-next"
      },
      // Брейкпоінти
      breakpoints: {
        319: {
          slidesPerView: 1,
          spaceBetween: 4
        },
        369.98: {
          slidesPerView: 2,
          spaceBetween: 4
        },
        649.98: {
          slidesPerView: 3,
          spaceBetween: 8
        },
        991.98: {
          slidesPerView: 3,
          spaceBetween: 10
        }
      },
      // Події
      on: {
        init(sw) {
          toggleLockSliderClass(this);
        },
        slideChange(sw) {
          toggleLockSliderClass(this);
        },
        resize(sw) {
          toggleLockSliderClass(this);
        }
      }
    });
  }
  if (document.querySelector(".proposals__slider")) {
    document.querySelectorAll(".proposals__slider").forEach((el) => {
      const parentSlider = el.parentElement;
      const swiperNextBtn = parentSlider.querySelector(".swiper-button-next");
      const swiperPrevBtn = parentSlider.querySelector(".swiper-button-prev");
      const swiperPagination = parentSlider.querySelector(".swiper-pagination");
      new Swiper(el, {
        modules: [Navigation, Pagination],
        observer: true,
        observeParents: true,
        slidesPerView: 5,
        spaceBetween: 0,
        speed: 800,
        // Пагінація
        pagination: {
          el: swiperPagination,
          clickable: true
        },
        // Кнопки "вліво/вправо"
        navigation: {
          prevEl: swiperPrevBtn,
          nextEl: swiperNextBtn
        },
        // Брейкпоінти
        breakpoints: {
          319: {
            slidesPerView: 1,
            spaceBetween: 0
          },
          369.98: {
            slidesPerView: 2,
            spaceBetween: 0
          },
          899.98: {
            slidesPerView: 3,
            spaceBetween: 0
          },
          1099.98: {
            slidesPerView: 4,
            spaceBetween: 0
          },
          1499.98: {
            slidesPerView: 5,
            spaceBetween: 0
          }
        },
        // Події
        on: {
          init(sw) {
            toggleLockSliderClass(this);
          },
          slideChange(sw) {
            toggleLockSliderClass(this);
          },
          resize(sw) {
            toggleLockSliderClass(this);
          }
        }
      });
    });
  }
  const productSlider = document.querySelectorAll(".product-detail__slider");
  if (productSlider.length) {
    const pageProductThumbs = new Swiper(".product-detail__thumbs", {
      modules: [],
      observer: true,
      observeParents: true,
      slidesPerView: 8,
      spaceBetween: 8,
      speed: 800,
      breakpoints: {
        319.98: {
          slidesPerView: 6,
          spaceBetween: 8
        },
        649.98: {
          spaceBetween: 8
        }
      }
    });
    productSlider.forEach((slider) => {
      const parentSlider = slider.parentElement;
      const swiperNextBtn = parentSlider.querySelector(".swiper-button-next");
      const swiperPrevBtn = parentSlider.querySelector(".swiper-button-prev");
      parentSlider.querySelector(".swiper-pagination");
      new Swiper(slider, {
        modules: [Navigation, Pagination, Thumb],
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 600,
        navigation: {
          prevEl: swiperPrevBtn,
          nextEl: swiperNextBtn
        },
        thumbs: {
          swiper: pageProductThumbs,
          autoScrollOffset: 1
        },
        on: {}
      });
    });
  }
  if (document.querySelector(".compare-block__slider")) {
    document.querySelectorAll(".compare-block__slider").forEach((el) => {
      const parentSlider = el.parentElement.closest("[data-compare]");
      const swiperNextBtn = parentSlider.querySelector(".swiper-button-next");
      const swiperPrevBtn = parentSlider.querySelector(".swiper-button-prev");
      const swiperScrollbar = parentSlider.querySelector(".swiper-scrollbar");
      resizableSwiper("(min-width: 40.6238em)", el, {
        modules: [Navigation, Scrollbar],
        observer: true,
        observeParents: true,
        slidesPerView: 3,
        spaceBetween: 20,
        speed: 350,
        // Пагінація
        navigation: {
          prevEl: swiperPrevBtn,
          nextEl: swiperNextBtn
        },
        scrollbar: {
          el: swiperScrollbar,
          draggable: true
        },
        breakpoints: {
          649.98: {
            slidesPerView: 2,
            spaceBetween: 12
          },
          991.98: {
            slidesPerView: 3,
            spaceBetween: 20
          }
        },
        on: {
          init(sw) {
            toggleLockSliderClass(this);
            syncCompareTable(this);
          },
          slideChange(sw) {
            toggleLockSliderClass(this);
            syncCompareTable(this);
          },
          resize(sw) {
            toggleLockSliderClass(this);
          }
        }
      });
    });
  }
  if (document.querySelector(".brands__slider")) {
    document.querySelectorAll(".brands__slider").forEach((el) => {
      const parentSlider = el.parentElement;
      const swiperNextBtn = parentSlider.querySelector(".swiper-button-next");
      const swiperPrevBtn = parentSlider.querySelector(".swiper-button-prev");
      const swiperPagination = parentSlider.querySelector(".swiper-pagination");
      new Swiper(el, {
        modules: [Navigation, Pagination],
        observer: true,
        observeParents: true,
        slidesPerView: 5,
        spaceBetween: 8,
        speed: 800,
        // Пагінація
        pagination: {
          el: swiperPagination,
          clickable: true
        },
        // Кнопки "вліво/вправо"
        navigation: {
          prevEl: swiperPrevBtn,
          nextEl: swiperNextBtn
        },
        // Брейкпоінти
        breakpoints: {
          319: {
            slidesPerView: 2,
            spaceBetween: 8
          },
          479.98: {
            slidesPerView: 3,
            spaceBetween: 8
          },
          649.98: {
            slidesPerView: 4,
            spaceBetween: 8
          },
          1099.98: {
            slidesPerView: 5,
            spaceBetween: 8
          }
        },
        // Події
        on: {
          init(sw) {
            toggleLockSliderClass(this);
          },
          slideChange(sw) {
            toggleLockSliderClass(this);
          },
          resize(sw) {
            toggleLockSliderClass(this);
          }
        }
      });
    });
  }
  if (document.querySelector(".articles__slider")) {
    document.querySelectorAll(".articles__slider").forEach((el) => {
      const parentSlider = el.parentElement;
      const swiperNextBtn = parentSlider.querySelector(".swiper-button-next");
      const swiperPrevBtn = parentSlider.querySelector(".swiper-button-prev");
      const swiperPagination = parentSlider.querySelector(".swiper-pagination");
      new Swiper(el, {
        modules: [Navigation, Pagination],
        observer: true,
        observeParents: true,
        slidesPerView: 3,
        spaceBetween: 36,
        speed: 800,
        // Пагінація
        pagination: {
          el: swiperPagination,
          clickable: true
        },
        // Кнопки "вліво/вправо"
        navigation: {
          prevEl: swiperPrevBtn,
          nextEl: swiperNextBtn
        },
        // Брейкпоінти
        breakpoints: {
          319: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          479.98: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          991.98: {
            slidesPerView: 3,
            spaceBetween: 24
          },
          1439.98: {
            slidesPerView: 3,
            spaceBetween: 36
          }
        },
        // Події
        on: {
          init(sw) {
            toggleLockSliderClass(this);
          },
          slideChange(sw) {
            toggleLockSliderClass(this);
          },
          resize(sw) {
            toggleLockSliderClass(this);
          }
        }
      });
    });
  }
};
document.querySelector("[data-fls-slider]") ? window.addEventListener("load", window.initSliders) : null;
