import { S as Swiper, N as Navigation, P as Pagination, A as Autoplay } from "./swiper.min.js";
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
function initSliders() {
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
}
document.querySelector("[data-fls-slider]") ? window.addEventListener("load", initSliders) : null;
